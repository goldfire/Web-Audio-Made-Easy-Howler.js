## Add Audio to Pomodoro
1. Generate audiosprite:
  > npm install -g audiosprite
  > audiosprite -e \"webm,mp3\" -f \"howler\" -o sounds tick.wav complete.wav
  2. Import Howl.
3. Setup the Howl instance.
4. Setup playback of ticks.
5. Setup playback of complete sound.

## Setup Steps
1. Get basic playback working of the ticking sound
  * Setup howler in the code and the sprite reference
  * Go over and install audiosprite
  * Generate the sprite file
  * Setup the sprite definition in code
  * Setup the tick sound
  * Setup the complete sound
2. Add rate increase function to tick at 2x
3. Setup panning so that the ticks go left/right
4. Change the ending sound to a live feed of CNN
  * http://tunein.streamguys1.com/cnn
5. Fade out the live feed after 5 seconds