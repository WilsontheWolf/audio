/// <reference types="node" />
import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { URL } from 'url';
import type { BaseNode } from '../base/BaseNode';
import type { ExceptionSeverity } from '../types/IncomingPayloads';
import { RoutePlanner } from './RoutePlanner';
export declare class HTTPError extends Error {
    method: string;
    statusCode: number;
    headers: IncomingHttpHeaders;
    path: string;
    constructor(httpMessage: IncomingMessage, method: string, url: URL);
    get statusMessage(): string | undefined;
}
export declare enum LoadType {
    /**
     * A single track is loaded.
     */
    TrackLoaded = "TRACK_LOADED",
    /**
     * A playlist is loaded.
     */
    PlaylistLoaded = "PLAYLIST_LOADED",
    /**
     * A search result is made (i.e `ytsearch: some song`).
     */
    SearchResult = "SEARCH_RESULT",
    /**
     * No matches/sources could be found for a given identifier.
     */
    NoMatches = "NO_MATCHES",
    /**
     * Lavaplayer failed to load something for some reason.
     */
    LoadFailed = "LOAD_FAILED"
}
/**
 * A track response containing all information about the request.
 */
export interface TrackResponse {
    /**
     * The type of response.
     * @example
     * ```json
     * "TRACK_LOADED"
     * ```
     */
    loadType: LoadType;
    /**
     * The playlist information.
     * @note Only filled when `loadType` is `LoadType.PlaylistLoaded`.
     * @example
     * ```json
     * {}
     * ```
     *
     * @example
     * ```json
     * {
     *   "name": "Example YouTube Playlist",
     *   "selectedTrack": 3
     * }
     */
    playlistInfo: PlaylistInfo | {};
    /**
     * The loaded tracks.
     * @example
     * ```json
     * [{
     *   "track": "QAAAjQIAJVJpY2sgQXN0bGV5IC0gTmV2ZXIgR29ubmEgR2l2ZSBZb3UgVXAADlJpY2tBc3RsZXlWRVZPAAAAAAADPCAAC2RRdzR3OVdnWGNRAAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9ZFF3NHc5V2dYY1EAB3lvdXR1YmUAAAAAAAAAAA==",
     *   "info": {
     *     "identifier": "dQw4w9WgXcQ",
     *     "isSeekable": true,
     *     "author": "RickAstleyVEVO",
     *     "length": 212000,
     *     "isStream": false,
     *     "position": 0,
     *     "title": "Rick Astley - Never Gonna Give You Up",
     *     "uri": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
     *   }
     * }]
     * ```
     */
    tracks: Track[];
    /**
     * Exception errors.
     * @note Only present when `loadType` is `LoadType.LoadFailed`.
     */
    exception?: {
        /**
         * Details why the track failed to load, and is okay to display to end-users.
         * @example
         * ```json
         * "The uploader has not made this video available in your country."
         * ```
         */
        message: string;
        /**
         * Severity represents how common the error is. A severity level of `COMMON` indicates that the error is
         * non-fatal and that the issue is not from Lavalink itself.
         */
        severity: ExceptionSeverity;
    };
}
/**
 * The playlist information.
 */
export interface PlaylistInfo {
    /**
     * The name of the playlist that was loaded.
     * @example
     * ```json
     * "Example YouTube Playlist"
     * ```
     */
    name: string;
    /**
     * The track that was selected from the playlist.
     * @example
     * ```json
     * 3
     * ```
     */
    selectedTrack: number;
}
export interface TrackInfo {
    /**
     * The identifier of the track.
     * @example
     * ```json
     * "dQw4w9WgXcQ"
     * ```
     */
    identifier: string;
    /**
     * Whether or not the track can be seeked.
     * @example
     * ```json
     * true
     * ```
     */
    isSeekable: boolean;
    /**
     * The author of the track.
     * @example
     * ```json
     * "RickAstleyVEVO"
     * ```
     */
    author: string;
    /**
     * The length in milliseconds of the track.
     * @example
     * ```json
     * 212000
     * ```
     */
    length: number;
    /**
     * Whether or not the track is a stream.
     * @example
     * ```json
     * false
     * ```
     */
    isStream: boolean;
    /**
     * The position at which the track was selected.
     * @example
     * ```json
     * 0
     * ```
     */
    position: number;
    /**
     * The title of the track.
     * @example
     * ```json
     * "Rick Astley - Never Gonna Give You Up"
     * ```
     */
    title: string;
    /**
     * The URI of the track.
     * @example
     * ```json
     * "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
     * ```
     */
    uri: string;
}
/**
 * The track information.
 */
export interface Track {
    /**
     * The track's data to be used when interacting with the Lavalink server.
     * @note You can use [[Http.decode]] to retrieve the information for the track using this string.
     * @example
     * ```json
     * "QAAAjQIAJVJpY2sgQXN0bGV5IC0gTmV2ZXIgR29ubmEgR2l2ZSBZb3UgVXAADlJpY2tBc3RsZXlWRVZPAAAAAAADPCAAC2RRdzR3OVdnWGNRAAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9ZFF3NHc5V2dYY1EAB3lvdXR1YmUAAAAAAAAAAA=="
     * ```
     */
    track: string;
    /**
     * The information for the track.
     * @example
     * {
     *   "identifier": "dQw4w9WgXcQ",
     *   "isSeekable": true,
     *   "author": "RickAstleyVEVO",
     *   "length": 212000,
     *   "isStream": false,
     *   "position": 0,
     *   "title": "Rick Astley - Never Gonna Give You Up",
     *   "uri": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
     * }
     */
    info: TrackInfo;
}
export declare class Http {
    readonly node: BaseNode;
    input: string;
    base: string | undefined;
    routeplanner: RoutePlanner;
    constructor(node: BaseNode, input: string, base?: string);
    get url(): URL;
    /**
     * Loads a track by its identifier.
     * @param identifier The track to be loaded.
     */
    load(identifier: string): Promise<TrackResponse>;
    /**
     * Decodes a track.
     * @param track The track to be decoded.
     * @example
     * ```typescript
     * const identifier = 'QAAAjQIAJVJpY2sgQXN0bGV5IC0gTmV2ZXIgR29ubmEgR2l2ZSBZb3UgVXAADlJpY2tBc3RsZXlWRVZPAAAAAAADPCAAC2RRdzR3OVdnWGNRAAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9ZFF3NHc5V2dYY1EAB3lvdXR1YmUAAAAAAAAAAA==';
     *
     * const track = await http.decode(identifier);
     * console.log(track);
     * // Logs: {
     * //   "identifier": "dQw4w9WgXcQ",
     * //   "isSeekable": true,
     * //   "author": "RickAstleyVEVO",
     * //   "length": 212000,
     * //   "isStream": false,
     * //   "position": 0,
     * //   "title": "Rick Astley - Never Gonna Give You Up",
     * //   "uri": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
     * // }
     * ```
     */
    decode(track: string): Promise<TrackInfo>;
    /**
     * Decodes multiple tracks.
     * @note This returns an array of [[Track]]s, not a [[TrackInfo]].
     * @param tracks The tracks to be decoded.
     */
    decode(tracks: string[]): Promise<Track[]>;
    decode(tracks: string | string[]): Promise<TrackInfo | Track[]>;
    do<T = any>(method: string, url: URL, data?: Buffer): Promise<T>;
}
//# sourceMappingURL=Http.d.ts.map