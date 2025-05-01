import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sanitizeHtml from "sanitize-html";

const createPlaylist = asyncHandler(async(req, res) => {
    const {name, description} = req.body
    const userId = req.user._id

    if (!name || !description) {
        throw new apiError(400, "Playlist name and description both are required")
    }

    const sanitizedName = sanitizeHtml(name, {
        allowedTags: [],
        allowedAttributes: [],
    })

    const sanitizedDescription = sanitizeHtml(description, {
        allowedTags: [],
        allowedAttributes: [],
    })

    const createdPlaylist = await Playlist.create(
        {
            name: sanitizedName,
            description: sanitizedDescription,
            videos: [],
            owner: userId
        }
    )

    const newPlaylist = await Playlist.findById(createdPlaylist._id)

    if (!newPlaylist) {
        throw new apiError(501, "Error while creating playlist")
    }

    return res 
    .status(201)
    .json(
        new apiResponse(201, {Playlist: newPlaylist}, "Playlist created Successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async(req, res) => {
    const {playlistId, videoId} = req.params
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Valid playlist id and video id is required")
    }

    const existingPlaylist = await Playlist.findById(playlistId)
    const existingVideo = await Video.findById(videoId)

    if (!existingPlaylist) {
        throw new apiError(404, "Playlist with this id not exist")
    }
    if (!existingVideo) {
        throw new apiError(404, "Video with this id not exist")
    }

    if (existingPlaylist.owner.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to modify playlist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos: videoId,
            }
        }, 
        {
            new: true
        }
    )

    if (!updatedPlaylist) {
        throw new apiError(500, "Error while adding video to playlist")
    }

    console.log("updatedPlaylist: ", updatedPlaylist);

    return res 
    .status(200)
    .json(
        new apiResponse(200, {updatedPlaylist}, "Video added Successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async(req, res) => {
    const {playlistId, videoId} = req.params
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new apiError(400, "Valid playlist id and video id is required")
    }

    const existingPlaylist = await Playlist.findById(playlistId)
    const existingVideo = await Video.findById(videoId)

    if (!existingPlaylist) {
        throw new apiError(404, "Playlist with this id not exist")
    }
    if (!existingVideo) {
        throw new apiError(404, "Video with this id not exist")
    }

    if (existingPlaylist.owner.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to modify playlist")
    }
    
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {videos: videoId}
        },
        {
            new: true
        }
    )

    if (!updatedPlaylist) {
        throw new apiError(500, "Error while removing video from playlist")
    }

    return res 
    .status(200)
    .json(
        new apiResponse(200, {updatedPlaylist}, "Video removed Successfully")
    )
})

const updatePlaylistInfo = asyncHandler(async(req, res) => {
    const {name, description} = req.body
    const {playlistId} = req.params
    const userId = req.user._id

    if (!name || !description) {
        throw new apiError(400, "Playlist name and description both are required")
    }

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new apiError(400, "Valid playlist id is required")
    }

    const existingPlaylist = await Playlist.findById(playlistId)
    if (!existingPlaylist) {
        throw new apiError(404, "Playlist with this id not exist")
    }

    if (existingPlaylist.owner.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to modify playlist")
    }

    const sanitizedName = sanitizeHtml(name, {
        allowedTags: [],
        allowedAttributes: [],
    })

    const sanitizedDescription = sanitizeHtml(description, {
        allowedTags: [],
        allowedAttributes: [],
    })

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name: sanitizedName,
                description: sanitizedDescription,
            }
        },
        {new: true}
    )

    if (!updatedPlaylist) {
        throw new apiError(500, "Error while updating playlist info")
    }

    return res 
    .status(200)
    .json(
        new apiResponse(200, {updatedPlaylist}, "Playlist info updated Successfully")
    )

})

const getPlaylistById = asyncHandler(async(req, res) => {
    const {playlistId} = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new apiError(400, "Valid playlist id is required")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new apiError(404, "No playlist found with this playlist id")
    }

    if (playlist.isPrivate && playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to view this playlist");
    }

    return res 
    .status(200)
    .json(
        new apiResponse(200, {playlist}, "Playlist fetched Successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new apiError(400, "Valid user id is required")
    }

    const playlists = await Playlist.find(
        {
            owner: userId
        }
    )

    if (!playlists || playlists.length === 0) {
        throw new apiError(404, "No found any playlist for this user")
    }

    return res 
    .status(200)
    .json(
        new apiResponse(
            200, 
            {
                totalPlaylist: playlists.length,
                playlists
            }, 
            "All playlists fetched successfully"
        )
    )

})

const togglePublishStatus = asyncHandler(async(req, res) => {
    const {playlistId} = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new apiError(400, "Valid playlist id is required")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new apiError(404, "No playlist found with this playlist id")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to modify this playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                isPrivate: !playlist.isPrivate
            }
        },
        {new: true}
    )

    return res 
    .status(200)
    .json(
        new apiResponse(200, {updatedPlaylist}, "Publish status toggled successfully")
    )

})

const deletePlaylist = asyncHandler(async(req, res) => {
    const {playlistId} = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new apiError(400, "Valid playlist id is required")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new apiError(404, "No playlist found with this playlist id")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to modify this playlist");
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlist._id)

    return res
    .status(200)
    .json(
        new apiResponse(200, {deletedPlaylist}, "Playlist deleted Successfully")
    )
})

export {
    createPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylistInfo,
    getPlaylistById,
    getUserPlaylists,
    togglePublishStatus,
    deletePlaylist
}