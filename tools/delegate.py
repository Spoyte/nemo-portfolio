#!/usr/bin/env python3
"""
delegate.py — Structured subagent delegation with clear contracts.
A Rams-like tool: simple, purposeful, quietly elegant.

Pattern captured: The recurring "spawn subagent → wait → integrate" workflow
benefits from explicit contracts, timeouts, and result handling.
"""

import json
import subprocess
import sys
from dataclasses import dataclass, asdict
from typing import Optional, List, Dict, Any
from datetime import datetime


@dataclass(frozen=True)
class TaskSpec:
    """Immutable task specification — the contract."""
    task: str
    agent_id: Optional[str] = None
    model: Optional[str] = None
    timeout_seconds: int = 120
    sandbox: str = "inherit"  # "inherit" | "require"
    attachments: List[Dict[str, Any]] = None
    
    def __post_init__(self):
        if self.attachments is None:
            object.__setattr__(self, 'attachments', [])


@dataclass(frozen=True)
class TaskResult:
    """Immutable result container."""
    success: bool
    output: str
    error: Optional[str] = None
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    duration_ms: Optional[int] = None


class Delegate:
    """
    Minimal subagent orchestrator.
    
    Usage:
        result = Delegate.run(TaskSpec(
            task="Analyze this code",
            agent_id="code-reviewer",
            timeout_seconds=60
        ))
    """
    
    @staticmethod
    def run(spec: TaskSpec) -> TaskResult:
        """Execute task via sessions_spawn, return structured result."""
        started = datetime.utcnow().isoformat() + "Z"
        started_ts = datetime.utcnow()
        
        # Build sessions_spawn invocation
        cmd = [
            "python3", "-c",
            Delegate._spawn_script(spec)
        ]
        
        try:
            output = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=spec.timeout_seconds + 10  # buffer for spawn overhead
            )
            
            completed = datetime.utcnow().isoformat() + "Z"
            duration = int((datetime.utcnow() - started_ts).total_seconds() * 1000)
            
            if output.returncode == 0:
                return TaskResult(
                    success=True,
                    output=output.stdout.strip(),
                    started_at=started,
                    completed_at=completed,
                    duration_ms=duration
                )
            else:
                return TaskResult(
                    success=False,
                    output=output.stdout.strip(),
                    error=output.stderr.strip() or f"Exit code {output.returncode}",
                    started_at=started,
                    completed_at=completed,
                    duration_ms=duration
                )
                
        except subprocess.TimeoutExpired:
            return TaskResult(
                success=False,
                output="",
                error=f"Task exceeded timeout ({spec.timeout_seconds}s)",
                started_at=started,
                completed_at=datetime.utcnow().isoformat() + "Z"
            )
        except Exception as e:
            return TaskResult(
                success=False,
                output="",
                error=str(e),
                started_at=started,
                completed_at=datetime.utcnow().isoformat() + "Z"
            )
    
    @staticmethod
    def _spawn_script(spec: TaskSpec) -> str:
        """Generate the Python script to execute sessions_spawn."""
        attachments_json = json.dumps(spec.attachments or [])
        
        return f'''
import json
from tools.sessions_spawn import sessions_spawn

result = sessions_spawn(
    task={repr(spec.task)},
    runtime="subagent",
    agent_id={repr(spec.agent_id)},
    model={repr(spec.model)},
    timeout_seconds={spec.timeout_seconds},
    sandbox={repr(spec.sandbox)},
    mode="run",
    attachments={attachments_json}
)
print(json.dumps(result))
'''


class PatternLog:
    """Append-only log of delegation patterns for continuous learning."""
    
    LOG_PATH = "logs/delegation_patterns.jsonl"
    
    @staticmethod
    def record(spec: TaskSpec, result: TaskResult, context: Optional[str] = None):
        """Log this delegation for pattern analysis."""
        import os
        os.makedirs(os.path.dirname(PatternLog.LOG_PATH), exist_ok=True)
        
        entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "spec": asdict(spec),
            "result": asdict(result),
            "context": context
        }
        
        with open(PatternLog.LOG_PATH, "a") as f:
            f.write(json.dumps(entry) + "\\n")


def main():
    """CLI entry: delegate.py '<task>' [--agent <id>] [--timeout <sec>]"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Delegate tasks to subagents")
    parser.add_argument("task", help="Task description")
    parser.add_argument("--agent", help="Agent ID", default=None)
    parser.add_argument("--timeout", type=int, default=120)
    parser.add_argument("--log", action="store_true", help="Log this delegation")
    parser.add_argument("--context", help="Context for log", default=None)
    
    args = parser.parse_args()
    
    spec = TaskSpec(
        task=args.task,
        agent_id=args.agent,
        timeout_seconds=args.timeout
    )
    
    result = Delegate.run(spec)
    
    if args.log:
        PatternLog.record(spec, result, args.context)
    
    print(json.dumps(asdict(result), indent=2))
    sys.exit(0 if result.success else 1)


if __name__ == "__main__":
    main()
