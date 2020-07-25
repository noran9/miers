const { dialog } = require('electron').remote
var Croppr = require('croppr');
const fs = require('electron').remote.require('fs');
const execFile = require('child_process').execFile;
var path = require('path');

var croppr = null;

// Elements
const image = document.getElementById('edit-image');
const title = document.getElementById('title');
const editor = document.getElementById('editor');
const browseButton = document.getElementById('browseButton');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const saturationSlider = document.getElementById('saturation');
const invertSlider = document.getElementById('invert');

// Set development variable
var isDevelopment = false;

browseButton.addEventListener('click', function(event){
    // OS check
    if (process.platform !== 'darwin') {
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { "name": "Images:", "extensions": ["png", "jpg", "jpeg"] }
            ]
        }).then( result => {
            image.src = result.filePaths[0];

            // Arrange elements
            title.innerText = "Please crop the image if you want to use super-resolution: "
            editor.hidden = false;
            browseButton.hidden = true;

            // Create croppr object
            croppr = new Croppr('#edit-image',{
                aspectRatio: 1,
                maxSize: [210, 210]
            });

        }).catch(err => {
            console.log(err);
        });
        
    } else {
        dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory'],
            filters: [
                { "name": "Images:", "extensions": ["png", "jpg", "jpeg"] }
            ]
        }).then( result => {
            image.src = result.filePaths[0];

            // Arrange elements
            title.innerText = "Please crop the image if you want to use super-resolution: "
            editor.hidden = false;
            browseButton.hidden = true;

            // Create croppr object
            croppr = new Croppr('#edit-image',{
                aspectRatio: 1,
                maxSize: [210, 210]
            });
        }).catch(err => {
            console.log(err);
        });
    }
});

editButton = document.getElementById('editButton');
editButton.addEventListener('click', async function(){
    var croppedPath = null;
    if (isDevelopment){
        croppedPath = path.join(__dirname,  '\\..\\misc\\images\\cropped-image.png');
    }
    else {
        croppedPath = path.join(__dirname,  '\\..\\..\\misc\\images\\cropped-image.png');
    }

    if (!fs.existsSync(croppedPath)){
        const url = canvas.toDataURL('image/jpg', 0.8);

        // remove Base64 stuff from the Image
        const base64Data = url.replace(/^data:image\/png;base64,/, "");
        await fs.writeFile(croppedPath, base64Data, 'base64', function (err) {
            console.log(err);
        });
    }

    //Arrange elements  
    editButton.hidden = true;
    brightnessSlider.disabled = false;
    contrastSlider.disabled = false;
    invertSlider.disabled = false;
    saturationSlider.disabled = false;
});

cropButton = document.getElementById('cropButton');
cropButton.addEventListener('click', function(event){
    data = croppr.getValue();

    var img = new Image();
    img.onload = function(){
        ctx.drawImage(
            img,
            data.x,
            data.y,
            data.width,
            data.height,
            0,
            0,
            canvas.width,
            canvas.height);
    }

    img.src = image.src;

    // Arrange elements
    canvas.hidden = false;
    var container = document.getElementsByClassName('croppr-container')[0];
    container.hidden = true;
    var cropButtonContainer = document.getElementById('cropButtonContainer');
    cropButtonContainer.hidden = true;
    title.innerText = "Adjust the values to visualize features";
    var filters = document.getElementById('filters');
    filters.hidden = false;
});



// Set filter values

let brightness = 100;
let contrast = 100;
let saturation = 100;
let invert = 0;

brightnessSlider.addEventListener("input", function(){
    brightness = brightnessSlider.value;
    applyFilters();
});

contrastSlider.addEventListener("input", function(){
    contrast = contrastSlider.value;
    applyFilters();
});

saturationSlider.addEventListener("input", function(){
    saturation = saturationSlider.value;
    applyFilters();
});

invertSlider.addEventListener("input", function(){
    invert = invertSlider.value;
    applyFilters();
});

function applyFilters(){
    ctx.filter = 
    'brightness(' + brightness +'%) ' +
    'contrast(' + contrast + '%) ' +
    'saturate(' + saturation + '%) ' +
    'invert(' + invert + '%)';

    const croppedimg = document.getElementById('cropped-result'); 
    var img = new Image();
    img.onload = function(){
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); 
    }

    if (isDevelopment) {
        img.src = path.join(__dirname, '\\..\\misc\\images\\cropped-image.png');
    }
    else {
        img.src = path.join(__dirname, '\\..\\..\\misc\\images\\cropped-image.png');
    }

    canvas.filter =
        'brightness(' + brightness +'%) ' +
        'contrast(' + contrast + '%) ' +
        'saturate(' + saturation + '%) ' +
        'invert(' + invert + '%)';

}

// Perform inference on model
const srButton = document.getElementById('superResolution');
srButton.addEventListener('click', async function(){
    var imagePath = null;
    if (isDevelopment){
        imagePath = path.join(__dirname, '\\..\\misc\\images\\sr-image\\image.png');
    }
    else {
        imagePath = path.join(__dirname, '\\..\\..\\misc\\images\\sr-image\\image.png');
    }
    

    var loadingGif = document.getElementById('loading-gif');
    loadingGif.hidden = false;

    const url = canvas.toDataURL('image/jpg', 0.8);
    const base64Data = url.replace(/^data:image\/png;base64,/, "");
    await fs.writeFile(imagePath, base64Data, 'base64', function (err) {
            console.log(err);
     });

     canvas.width = 420;
     canvas.height = 420;
     applyFilters();

    // Execute command
    var commandPath = null;
    if (isDevelopment){
        commandPath = path.join(__dirname, '\\..\\misc\\runInference.cmd');
    }
    else {
        commandPath = path.join(__dirname, '\\..\\..\\misc\\runInference.cmd');
    }

    execFile(commandPath, (err, stdout, stderr) => {
            if (err) {
              console.error(err);
              return;
            }

            // Load super resolution image
            srImagePath = null;
            if (isDevelopment){
                srImagePath = path.join(__dirname, '\\..\\misc\\mmsr\\results\\ESRGAN_x4\\set1\\image.png');
            }
            else {
                srImagePath = path.join(__dirname, '\\..\\..\\misc\\mmsr\\results\\ESRGAN_x4\\set1\\image.png');
            }
            
            var img = new Image();
            img.onload = function(){

                // Reset filters
                ctx.filter = 
                'brightness(100%) ' +
                'contrast(100%) ' +
                'saturate(100%) ' +
                'invert(0%)';

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const url = canvas.toDataURL('image/jpg', 0.8);
            }
        
            img.src = srImagePath;
            loadingGif.hidden = true;
    });
});

const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', async function(){
    const e = new MouseEvent('click');

    // Create link
    const link = document.createElement('a');

    link.download = 'edited-image.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.8);
    link.dispatchEvent(e);
});