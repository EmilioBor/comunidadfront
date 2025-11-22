'use service';

import { getChatByPerfil } from "../../lib/api/chat";

export async function obternerChatByPerfil(params) {
    return await getChatByPerfil(params);
}