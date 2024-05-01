#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";

let list = [];
fs.appendFile("tasks.txt", JSON.stringify([]), () => {});
function todoCycle() {
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "What to do with your todo?",
        choices: [
          "Add task",
          "View task",
          "Delete task",
          `${chalk.redBright("Exit todo")}`,
        ],
      },
    ])
    .then((ans) => {
      if (ans.action == "Add task") {
        inquirer
          .prompt([
            {
              name: "add",
              type: "input",
              message: "add a task to your todo",
            },
          ])
          .then((ans) => {
            list.push(ans.add);
            fs.appendFile(
              "tasks.txt",
              JSON.stringify([list[list.length - 1]]),
              () => {}
            );
            console.log(chalk.greenBright("Task added successfully!"));
            todoCycle();
          });
      } else if (ans.action == "View task") {
        console.log("\t");
        console.log(chalk.bgBlue.bold("Your Todo List:"));
        fs.readFile("tasks.txt", "utf8", (err, data) => {
          data = data.replace("[]", `["Some task"]`);
          data = JSON.parse(data.split("]["));
          data = data.filter((val) => {
            return val != "Some task";
          });
          list = data;
          data.forEach((elem, i) => {
            console.log(chalk.blue(`${i + 1}. ${elem}`));
          });

          console.log("\t");
          todoCycle();
        });
      } else if (ans.action == "Delete task") {
        inquirer
          .prompt([
            {
              name: "delete",
              type: "list",
              message: "Delete a task",
              choices: list,
            },
          ])
          .then((ans) => {
            list = list.filter((val) => {
              return val != ans.delete;
            });
            fs.writeFile("tasks.txt", JSON.stringify(list), (err) => {
              if (err) console.log(err);
            });
            console.log(chalk.greenBright("Task deleted successfully!"));
            todoCycle();
          });
      } else if (ans.action == `${chalk.redBright("Exit todo")}`) {
        console.log("Complete all your tasks!");
      }
    });
}

todoCycle();
