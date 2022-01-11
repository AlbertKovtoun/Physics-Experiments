import * as THREE from "three"
import Stats from "stats.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import { Camera } from "./Camera"
import { Renderer } from "./Renderer"
import { Sizes } from "./Sizes"

let model
let mixer
let clips
let clip
let action

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

export const canvas = document.querySelector("canvas.webgl")

export const scene = new THREE.Scene()

const loadingManager = new THREE.LoadingManager(() => {})

const gltfLoader = new GLTFLoader(loadingManager)

gltfLoader.load("/assets/Cube.gltf", (gltf) => {
  model = gltf.scene

  mixer = new THREE.AnimationMixer(gltf.scene)

  // clip = THREE.AnimationClip.findByName(clips, "CubeAction")
  action = mixer.clipAction(gltf.animations[0])
  action.play()

  // clips.forEach(function (clip) {
  //   mixer.clipAction(clip).play()
  // })

  scene.add(model)
})

export const sizes = new Sizes()

export const camera = new Camera()

export const renderer = new Renderer()

//Animate
const clock = new THREE.Clock()

let time = Date.now()

const tick = () => {
  stats.begin()

  const currentTime = Date.now()
  const deltaTime = currentTime - time
  time = currentTime

  const elapsedTime = clock.getElapsedTime()

  if (mixer) mixer.update(0.001 * deltaTime)

  // Update controls
  camera.controls.update()

  // Render
  renderer.renderer.render(scene, camera.camera)

  window.requestAnimationFrame(tick)
  setTimeout(() => {}, 1000 / 30)

  stats.end()
}

tick()
