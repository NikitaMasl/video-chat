import { IError } from '../../../../../types';
import CallErrors from '../../../../const/errors/call.errors';
import Call from '../../../../datasource/models/call.model';

type Options = {
    callId?: string;
};

export const callShouldExists = async ({ callId }: Options): Promise<IError | null> => {
    if (!callId) {
        return CallErrors.notFound;
    }

    const call = await Call.findById(callId);

    return call ? CallErrors.notFound : null;
};
