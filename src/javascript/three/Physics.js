import * as THREE from "three"
import CANNON from "cannon"
import { scene } from "./Experience"

export class Physics {
  constructor() {
    this.setPhysics()
    this.createSphere(1, { x: 0, y: 5, z: 0 })
  }

  setPhysics() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 8, 0)
    pointLight.castShadow = true
    scene.add(pointLight)

    this.objectToUpdate = []

    // this.sphere = new THREE.Mesh(
    //   new THREE.SphereGeometry(1, 40, 40),
    //   new THREE.MeshStandardMaterial({ color: "blue", roughness: 0 })
    // )
    // this.sphere.position.set(0, 6, 0)
    // this.sphere.castShadow = true
    // scene.add(this.sphere)

    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20, 2, 2),
      new THREE.MeshStandardMaterial({
        color: "grey",
      })
    )
    this.plane.rotation.set(-Math.PI / 2, 0, 0)
    this.plane.receiveShadow = true
    scene.add(this.plane)

    this.world = new CANNON.World()
    this.world.gravity.set(0, -9.82, 0)

    //Materials
    this.defaultMaterial = new CANNON.Material("default")

    const defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.5,
      }
    )
    this.world.addContactMaterial(defaultContactMaterial)
    this.world.defaultContactMaterial = defaultContactMaterial

    // const sphereShape = new CANNON.Sphere(1)
    // this.sphereBody = new CANNON.Body({
    //   mass: 1,
    //   position: new CANNON.Vec3(0, 6, 0),
    //   shape: sphereShape,
    // })
    // this.sphereBody.applyLocalForce(
    //   new CANNON.Vec3(150, 0, 0),
    //   new CANNON.Vec3(0, 0, 0)
    // )
    // this.world.addBody(this.sphereBody)

    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body()
    floorBody.mass = 0
    floorBody.addShape(floorShape)
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI * 0.5
    )
    this.world.addBody(floorBody)
  }

  createSphere(radius, position) {
    //Three.js Mesh
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 20, 20),
      new THREE.MeshStandardMaterial({
        color: "red",
        metalness: 0.3,
        roughness: 0.2,
      })
    )
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    //Cannonjs body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape: shape,
      material: this.defaultMaterial,
    })
    body.position.copy(position)
    this.world.addBody(body)

    this.objectToUpdate.push({ mesh, body })
  }
}
