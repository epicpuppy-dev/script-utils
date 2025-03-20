# script-utils

Defines 4 classes: `Container`, `Task`, `Script`, and `ScriptMenu`

## Container
Defines a format for data storage. Containers are used to pass data between tasks.

## Task
Defines a single step in a script. Accepts some arbitrary function that takes a input container and returns an output container.

## Script
Chains together multiple tasks. Defines the source of the input container's data and the destination of the output container's data.

## ScriptMenu
A tool for creating a CLI to run scripts without having to run them individually.
