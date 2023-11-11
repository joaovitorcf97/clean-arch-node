export class ExistingTitleError extends Error {
  public readonly name = 'ExistingTitleError';

  constructor() {
    super('User alredy has create note with the same title');
  }
}
