let voices = [];

let inputs = 1;

window.speechSynthesis.addEventListener('voiceschanged', () => {
  voices = window.speechSynthesis.getVoices();
});

const sing = (text, rate = 1.0, pitch = 1.0) => {
  return new Promise(resolve => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.voice = voices.find(voice => voice.lang === 'en-US');
    speech.pitch = pitch;
    speech.rate = rate;
    window.speechSynthesis.speak(speech);
    speech.addEventListener('end', () => {
      resolve();
    });
  });
}

const wait = millisecs => {
  return new Promise(resolve => {
    setTimeout(resolve, millisecs);
  });
}

const playSong = async () => {
  // get text from inputs
  const inputContainers = document.querySelectorAll('.input-container');
  for (let i = 0; i < inputContainers.length; i++) {
    const inputContainer = inputContainers[i];

    if (inputContainer.classList.contains('wait-input-container')) {
      const millisecs = inputContainer.querySelector('input').value;
      await wait(parseInt(millisecs));
    } else {
      const text = inputContainer.querySelector('.sentence-input').value;
      const rate = inputContainer.querySelector('.rate-input').value;
      const pitch = inputContainer.querySelector('.pitch-input').value;
      await sing(text, rate, pitch);
    }
  }
}

const addInput = () => {
  inputs ++;
  const container = document.querySelector('#sentence-inputs-container');
  const input = `
  <div class="mt-3 input-container wait-input-container">
    <span>Wait</span>
    <input type="text" value="10" class="wait-input">
    <span>Milliseconds</span>
  </div>
  <div class="mt-3 input-container">
    <input type="text" class="sentence-input" placeholder="Add sentence...">
    <label for="rate-${inputs}">Rate</label>
    <input type="number" class="rate-input" value="1" id="rate-${inputs}">
    <label for="pitch-${inputs}">Pitch</label>
    <input type="number" class="pitch-input" value="1" id="pitch-${inputs}">
  </div>
  `;
  container.insertAdjacentHTML('beforeend', input);
}

document.querySelector('#play-btn').addEventListener('click', () => {
  playSong();
});

document.querySelector('#add-sentence-btn').addEventListener('click', () => {
  addInput();
});