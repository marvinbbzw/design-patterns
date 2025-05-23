export interface EditorState {
  onInput(): void;
  onSave(): void;
  onSaveAs(): void;
  onNew(): void;
  getLabel(): string;
}

export class Editor {
  private state: EditorState;
  public text: string = "";
  public fileName?: string;

  constructor(initialState: EditorState) {
    this.state = initialState;
    this.state["_context"] = this;
  }

  public setState(state: EditorState) {
    this.state = state;
    this.state["_context"] = this;
    setStateLabel(this.state.getLabel());
  }

  public getState(): EditorState {
    return this.state;
  }

  public input(text: string) {
    this.text = text;
    this.state.onInput();
  }

  public save() {
    this.state.onSave();
  }

  public saveAs() {
    this.state.onSaveAs();
  }

  public newFile() {
    this.text = "";
    this.fileName = undefined;
    this.state.onNew();
  }
}

function setStateLabel(value: string) {
  const stateLabel = document.getElementById("state-label");
  if (stateLabel) stateLabel.innerText = value;
}

export abstract class BaseState implements EditorState {
  protected _context!: Editor;

  onInput(): void {}
  onSave(): void {}
  onSaveAs(): void {}
  onNew(): void {}

  abstract getLabel(): string;
}

export class CleanUnsaved extends BaseState {
  onInput() {
    this._context.setState(new DirtyUnsaved());
  }

  onSaveAs() {
    const name = prompt("Dateiname?") ?? "";
    if (!name.trim()) return;
    const fname = name.endsWith(".txt") ? name : name + ".txt";
    localStorage.setItem(fname, this._context.text);
    this._context.fileName = fname;
    this._context.setState(new CleanSaved());
  }

  onNew() {
    this._context.setState(new CleanUnsaved());
  }

  getLabel(): string {
    return "*";
  }
}

export class DirtyUnsaved extends BaseState {
  onSaveAs() {
    const name = prompt("Dateiname?") ?? "";
    if (!name.trim()) return;
    const fname = name.endsWith(".txt") ? name : name + ".txt";
    localStorage.setItem(fname, this._context.text);
    this._context.fileName = fname;
    this._context.setState(new CleanSaved());
  }

  onNew() {
    this._context.setState(new CleanUnsaved());
  }

  getLabel(): string {
    return "*";
  }
}

export class CleanSaved extends BaseState {
  onInput() {
    this._context.setState(new DirtySaved());
  }

  onSave() {
    localStorage.setItem(this._context.fileName!, this._context.text);
    this._context.setState(new CleanSaved());
  }

  onNew() {
    this._context.setState(new CleanUnsaved());
  }

  getLabel(): string {
    return this._context.fileName!;
  }
}

export class DirtySaved extends BaseState {
  onSave() {
    localStorage.setItem(this._context.fileName!, this._context.text);
    this._context.setState(new CleanSaved());
  }

  onNew() {
    this._context.setState(new CleanUnsaved());
  }

  getLabel(): string {
    return this._context.fileName! + " *";
  }
}