import { Either, left, right } from '@/shared/either';
import { NoteRepository } from '../ports/node-repository';
import { UseCase } from '../ports/use-case';
import { UnexistingNoteError } from './error/unexisting-note-error';

export class RemoveNote implements UseCase {
  private readonly noteRepository: NoteRepository;

  constructor(noteRepository: NoteRepository) {
    this.noteRepository = noteRepository;
  }

  public async perform(
    noteId: string
  ): Promise<Either<UnexistingNoteError, void>> {
    if (await this.noteRepository.findById(noteId)) {
      return right(await this.noteRepository.remove(noteId));
    }

    return left(new UnexistingNoteError());
  }
}
