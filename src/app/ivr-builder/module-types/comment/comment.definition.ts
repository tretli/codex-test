import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsCommentComponent } from './comment.details.component';

export const commentModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Comment,
  key: 'comment',
  component: IvrModuleDetailsCommentComponent,
  preferredLinkField: 'nextModuleId'
});
