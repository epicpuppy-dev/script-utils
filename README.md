# script-utils

A small library for creating and running modular scripts. Works off of a reusable task-based system.

**Not designed for production use**

## Install
```npm install @epicpuppy-dev/script-utils```

## Documentation

Defines 3 classes: `Container`, `Task`, and `Script`

### Container
Defines a format for data storage. Containers are used to pass data between tasks. Each container stores 1 entry of data, multi-containers will be implemented at a later date.

### Task
Defines a single step in a script. Accepts some arbitrary function that takes input container(s) and returns output container(s).

### Script
Chains together multiple tasks. Defines the source of the input container's data. The output data can be manually extracted from the last task in the chain with `task.extract(containerName)`

## Example Usage

### Simple Script
```ts
import { Container, Script, Task } from '@epicpuppy-dev/script-utils';
import crypto from 'crypto';

interface Input {
    name: string;
    birthday: Date;
}
interface Person {
    name: string;
    age: number;
}
interface PersonHash {
    hash: string;
}

new Container<Input>("input");
new Container<Person>("person");
new Container<PersonHash>("hash");

const person = new Task<[Input], [Person]>("person", "Create Person", ["input"], ["person"], async (runner, input) => {
    // Some processing code here
    return [{
        name: input.name,
        age: new Date().getFullYear() - input.birthday.getFullYear(),
    }];
});
const hash = new Task<[Person], [PersonHash]>("hash", "Create Hash", ["person"], ["hash"], async (runner, person) => {
    // Some other processing code here
    return [{
        hash: crypto.createHash('sha256').update(person.name).digest('hex'),
    }];
});

const script = new Script([person, hash], ["input"]);

await script.execute({name: "A Person", birthday: new Date()});

console.log(hash.extract("hash")); // Manually extract data from last task in chain
```

### Script with Progress Bar / Updates
```ts
import { Container, Script, Task } from '@epicpuppy-dev/script-utils';
import crypto from 'crypto';

interface Input {
    name: string;
    birthday: Date;
}
interface Person {
    name: string;
    age: number;
}
interface PersonHash {
    hash: string;
}

new Container<Input>("input");
new Container<Person>("person");
new Container<PersonHash>("hash");

const person = new Task<[Input], [Person]>("person", "Create Person", ["input"], ["person"], async (runner, input) => {
    // Some processing code here
    return [{
        name: input.name,
        age: new Date().getFullYear() - input.birthday.getFullYear(),
    }];
});
const hash = new Task<[Person], [PersonHash]>("hash", "Create Hash", ["person"], ["hash"], async (runner, person) => {
    // Some iterative processing code that may take longer
    for (let i = 0; i < 100; i++) {
        runner.progress(`${i}%`);
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    return [{
        hash: crypto.createHash('sha256').update(person.name).digest('hex'),
    }];
});

const script = new Script([person, hash], ["input"], {progressMode: true});

await script.execute({name: "A Person", birthday: new Date()});

console.log(hash.extract("hash")); // Manually extract data from last task in chain
```

## Other Notes
Tasks can be defined in some other file and imported into the main script file. This is useful for larger scripts or multiple scripts in the same index file. Containers and Tasks are stored in a global registry, so they can be accessed from anywhere in the project.
