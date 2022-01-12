import * as THREE from "three"
import CANNON from "cannon"
import Stats from "stats.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import { Camera } from "./Camera"
import { Renderer } from "./Renderer"
import { Sizes } from "./Sizes"
import { Physics } from "./Physics"

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

export const canvas = document.querySelector("canvas.webgl")

export const scene = new THREE.Scene()

export const physics = new Physics()

export const sizes = new Sizes()

export const camera = new Camera()

export const renderer = new Renderer()

//Animate
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  //Update physics world

  // physics.sphereBody.applyForce(
  //   new CANNON.Vec3(-0.5, 0, 0),
  //   physics.sphereBody.position
  // )

  physics.world.step(1 / 60, deltaTime, 3)

  for (const object of physics.objectToUpdate) {
    object.mesh.position.copy(object.body.position)
  }

  // physics.sphere.position.copy(physics.sphereBody.position)

  // Update controls
  camera.controls.update()

  // Render
  renderer.renderer.render(scene, camera.camera)

  setTimeout(() => {
    window.requestAnimationFrame(tick)
  }, 1000 / 60)

  stats.end()
}

tick()
