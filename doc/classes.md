## ScriptUtils
A tool for creating a CLI to run scripts without having to run them individually. Not strictly required for scripts, but useful for larger script collections.

## Container
Defines a format for data storage. Containers are used to pass data between tasks.

## Task
Defines a single step in a script. Accepts some arbitrary function that takes a input container and returns an output container.

## Script
Chains together multiple tasks. Defines the source of the input container's data and the destination of the output container's data.

## Runtime
A utility class that manages the runtime envrionment. Takes care of all script, task, and container management.

## Runner
An API that is exposed to all tasks that provide utility functions. Will handle console output, progress updates, and user input.