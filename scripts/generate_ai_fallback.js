const fs = require('fs');
const https = require('https');

const prompt = "A highly realistic photograph for a corporate hero banner. Visual of a street in a rural village habitation. In the foreground on the extreme left side, villagers are collecting water from a newly installed water connection made of GI Nipples and a brass tap. Villagers are filling buckets and tubs. The road is made of interlocking pavers or cement. A beautiful cloudy sky blue sky is visible above. Houses are made of raw bricks with no plastering, big and small. Highly realistic, 8k, extremely high quality, cinematic, bright. The main subjects (water tap and villagers) MUST be anchored to the far left side.";
const encodedPrompt = encodeURIComponent(prompt);
const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1920&height=1080&nologo=true`;

const dest = "d:/KSPL/DPR-APP/infra-os/public/DATA/AI_VILLAGE_BANNER.png";

const file = fs.createWriteStream(dest);

https.get(url, function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close(() => {
        console.log("Image downloaded successfully from alternate AI API!");
    });
  });
}).on('error', function(err) {
  fs.unlink(dest, () => {});
  console.error("Error downloading image:", err.message);
});
