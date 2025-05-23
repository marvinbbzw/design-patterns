import {
  Editor,
  CleanUnsaved,
  CleanSaved,
} from "./text-editor-state";

const textArea = document.getElementById("text") as HTMLTextAreaElement;
const saveButton = document.getElementById("save-button");
const saveAsButton = document.getElementById("save-as-button");
const newButton = document.getElementById("new-button");

const editor = new Editor(new CleanUnsaved());

document.addEventListener("DOMContentLoaded", () => {
  showFiles(listFiles(), "files-list");

  textArea.addEventListener("input", () => {
    editor.input(textArea.value);
  });

  saveAsButton?.addEventListener("click", () => {
    editor.saveAs();
    showFiles(listFiles(), "files-list");
  });

  saveButton?.addEventListener("click", () => {
    editor.save();
    showFiles(listFiles(), "files-list");
  });

  newButton?.addEventListener("click", () => {
    editor.newFile();
    textArea.value = "";
  });

  document.addEventListener("contextmenu", (event) => {
    alert("Wanna steal my source code, huh!?");
    event.preventDefault();
  });
});

function showFiles(files: string[], parentId: string) {
  const parent = document.getElementById(parentId)!;
  while (parent.firstChild) parent.removeChild(parent.firstChild);
  for (const file of files) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.innerHTML = file;
    link.addEventListener("click", () => {
      const content = localStorage.getItem(file);
      editor["fileName"] = file;
      editor.text = content ?? "";
      textArea.value = content ?? "";
      editor.setState(new CleanSaved());
    });
    item.appendChild(link);
    parent.append(item);
  }
}

function listFiles(): string[] {
  const files: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    files.push(localStorage.key(i)!);
  }
  return files;
}