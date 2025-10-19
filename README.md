# Simple Workflow Engine

Simple workflow engine is engine that allows you to create and manage workflows. It is a very simple and primitive implementation of a running dynamic and untrusted code. It is not something that you should directly use in production without proper security measures. It uses V8 vm to execute untrusted code with proper context isolation but still have to be carefully audited [VM.ts](packages/engine/src/engine/vm/index.ts).

This project is for developers who want to start building their own workflow engine for personal or company use. Consider it as a starting point for your own engine.

Dev Deployment

- API: https://engine-api.nisargbhatt.org
- Docs: https://engine-docs.nisargbhatt.org
- Frontend: https://engine.nisargbhatt.org
