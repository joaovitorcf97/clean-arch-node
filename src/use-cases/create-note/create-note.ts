import { InvalidTitleError } from '@/entities/errors/invalid-title-error';
import { Note } from '@/entities/note';
import { User } from '@/entities/user';
import { Either, left, right } from '@/shared/either';
import { NoteData } from '../ports/node-data';
import { NoteRepository } from '../ports/node-repository';
import { UseCase } from '../ports/use-case';
import { UserRepository } from '../ports/user-repository';
import { ExistingTitleError } from './errors/existing-title-error';
import { UnregisteredOwnerError } from './errors/invalid-owner-error';

export class CreateNote implements UseCase {
  private readonly noteRepository: NoteRepository;
  private readonly userRepository: UserRepository;

  constructor(noteRepository: NoteRepository, userRepository: UserRepository) {
    this.noteRepository = noteRepository;
    this.userRepository = userRepository;
  }

  public async perform(
    request: NoteData
  ): Promise<
    Either<
      ExistingTitleError | UnregisteredOwnerError | InvalidTitleError,
      NoteData
    >
  > {
    const owner = await this.userRepository.findByEmail(request.ownerEmail);

    if (!owner) {
      return left(new UnregisteredOwnerError());
    }

    const ownerUser = User.create(owner.email, owner.password).value as User;
    const noteOrError = Note.create(ownerUser, request.title, request.content);

    if (noteOrError.isLeft()) {
      return left(noteOrError.value);
    }

    const owenerNotes: NoteData[] = await this.noteRepository.findAllNotesForm(
      owner.id!
    );
    const noteExists = owenerNotes.find((note) => note.title === request.title);

    if (noteExists) {
      return left(new ExistingTitleError());
    }

    const note: Note = noteOrError.value;

    return right(
      await this.noteRepository.add({
        title: note.title.value,
        content: note.content,
        ownerEmail: ownerUser.email.value,
        ownerId: owner.id,
      })
    );
  }
}
