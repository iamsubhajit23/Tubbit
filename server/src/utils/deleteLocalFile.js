import fs from 'fs'

export const deleteLocalFile = (localfilepath) => {
    if(!localfilepath) return;
    try {
        fs.unlinkSync(localfilepath)
    } catch (error) {
        console.error(`Error deleting file at ${localfilepath}:`, error.message)
    }
}