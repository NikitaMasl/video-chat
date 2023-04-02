import superagent from 'superagent';

export interface Options {
    url: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    data?: Record<string, unknown>;
    headers?: Record<string, string>;
}
export const sendHttpRequest = async ({ url, method, data, headers = {} }: Options): Promise<superagent.Response> => {
    return superagent[method](url)
        .send(data)
        .type('application/json')
        .set({ ...headers, Accept: 'json' });
};
