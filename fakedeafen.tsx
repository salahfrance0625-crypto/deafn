import definePlugin, { OptionType } from "@utils/types";
import { webpack } from "@webpack";

export default definePlugin({
    name: "FakeDeafen",
    description: "Fakes your mute and deafen status to others while letting you hear and speak normally.",
    authors: [{ name: "User", id: 0n }],

    options: {
        fakeMute: {
            type: OptionType.BOOLEAN,
            name: "Fake Mute",
            description: "Show mute icon to others while remaining unmuted locally",
            default: true,
            onChange() {
                updateVoiceState();
            }
        },
        fakeDeafen: {
            type: OptionType.BOOLEAN,
            name: "Fake Deafen",
            description: "Show deafen icon to others while remaining undeafened locally",
            default: true,
            onChange() {
                updateVoiceState();
            }
        }
    },

    start() {
        updateVoiceState();
    },

    stop() {
        // Reset or clean up state patches when plugin is disabled
        const MediaEngine = webpack.getByProps("getMediaEngine");
        const conn = MediaEngine?.getMediaEngine()?.conn;
        if (conn) {
            if (typeof conn.setSelfDeaf === "function") conn.setSelfDeaf(false);
            if (typeof conn.setSelfMute === "function") conn.setSelfMute(false);
        }
    }
});

function updateVoiceState() {
    const MediaEngine = webpack.getByProps("getMediaEngine");
    if (!MediaEngine) return;

    const conn = MediaEngine.getMediaEngine()?.conn;
    if (conn) {
        const options = (globalThis as any).Vencord?.Plugins?.plugins?.FakeDeafen?.options;
        const fakeDeaf = options?.fakeDeafen ?? true;
        const fakeMute = options?.fakeMute ?? true;

        if (typeof conn.setSelfDeaf === "function") {
            conn.setSelfDeaf(fakeDeaf);
        }
        if (typeof conn.setSelfMute === "function") {
            conn.setSelfMute(fakeMute || fakeDeaf);
        }
    }
}