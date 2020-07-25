# Microscopic Images Editor and Resolution Stimulator (MIERS)

An ElectronJS application for loading, editing and saving images and running inference on the chosen image on a trained ESRGAN model for single image super-resolution. The ESRGAN implementation used is from: [OpenLab MMSR](https://github.com/open-mmlab/mmediting). Training experiments and models comparison is available on: [Super resolution on microscopic images of different tissues using GAN architectures](https://github.com/noran9/microscopic-images-srgan)

Requirements:
- Windows 10
- Anaconda pytorch environment named pytorch

UI Preview:

### Crop the image:
![image-crop](https://github.com/noran9/miers/blob/master/pictures/crop-screen.PNG)

### Image editor:
![edit](https://github.com/noran9/miers/blob/master/pictures/screen.PNG)



## Build instructions:

``npm install && npm run dist``

The executable installer is in the dist directory.



## Development instructions:

Change isDevelopment to true (renderer.js line 24)

``npm start``
