class Beat {
  readonly id: number;
  readonly level: number;

  static readonly MAX_LEVEL = 3;

  constructor(id: number, levels: number) {
    this.id = id;
    this.level = levels;
  }

  static newBeat(id: number): Beat {
    return new Beat(id, 1);
  }

  increase(): Beat {
    return new Beat(this.id, (this.level + 1) % (Beat.MAX_LEVEL + 1));
  }
}

export default Beat;
