import { NoteData } from '../ports/node-data';
import { NoteRepository } from '../ports/node-repository';
import { UseCase } from '../ports/use-case';

export class LoadNotes implements UseCase {
  private readonly noteRepository: NoteRepository;

  constructor(noteRepository: NoteRepository) {
    this.noteRepository = noteRepository;
  }

  public async perform(requestUserId: string): Promise<NoteData[]> {
    return await this.noteRepository.findAllNotesForm(requestUserId);
  }
}
