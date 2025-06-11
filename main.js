let scene, camera, renderer, bottle;
let score = 0;
const maxScore = 100;

document.getElementById("start-btn").addEventListener("click", showAd);
document.getElementById("replay-btn").addEventListener("click", resetGame);

function showAd() {
  const ad = document.getElementById("ad-screen");
  const video = document.getElementById("ad-video");
  const skipBtn = document.getElementById("skip-btn");

  ad.style.display = "flex";
  video.play();
  skipBtn.disabled = true;

  const enableSkip = setTimeout(() => {
    skipBtn.disabled = false;
  }, 5000);

  skipBtn.onclick = () => {
    if (!skipBtn.disabled) {
      video.pause();
      ad.style.display = "none";
      clearTimeout(enableSkip);
      startGame();
    }
  };

  video.onended = () => {
    ad.style.display = "none";
    clearTimeout(enableSkip);
    startGame();
  };
}

function startGame() {
  document.getElementById("game-screen").style.display = "flex";
  initThree();
}

function initThree() {
  const container = document.getElementById("three-container");
  container.innerHTML = "";

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(800, 600);
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);

  const loader = new THREE.GLTFLoader();
  loader.load('assets/bottle.glb', gltf => {
    bottle = gltf.scene;
    bottle.position.set(0, 0, 0);
    scene.add(bottle);
    camera.position.z = 5;
    animateFlip();
  });

  const blockIndex = Math.floor(Math.random() * 5) + 1;
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(`assets/block${blockIndex}.png`);

  const block = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.5, 2),
    new THREE.MeshBasicMaterial({ map: texture })
  );
  block.position.y = -1;
  scene.add(block);
}

function animateFlip() {
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    if (bottle) {
      bottle.rotation.x += 0.3;
      bottle.position.y = Math.abs(Math.sin(t)) * 2;
    }
    renderer.render(scene, camera);
    t += 0.05;
    if (t > 6.28) {
      landBottle();
    }
  }
  animate();
}

function landBottle() {
  const result = Math.random() > 0.4;
  if (result) {
    score += 10;
    document.getElementById("sound-landed").play();
  } else {
    document.getElementById("sound-missed").play();
  }

  if (score >= maxScore) {
    document.getElementById("message").innerText = "🏆 You Win!";
    document.getElementById("replay-btn").style.display = "block";
  } else if (!result) {
    document.getElementById("message").innerText = "😢 You missed!";
    document.getElementById("replay-btn").style.display = "block";
  } else {
    setTimeout(animateFlip, 1000);
  }
}

function resetGame() {
  score = 0;
  document.getElementById("replay-btn").style.display = "none";
  document.getElementById("message").innerText = "";
  initThree();
}