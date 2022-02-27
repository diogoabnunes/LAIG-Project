# LAIG 2020/2021 - TP2

## Group: T02G02

| Name               | Number    | E-Mail               |
| ------------------ | --------- | -------------------- |
| Diogo Nunes        | 201808546 | up201808546@fe.up.pt |
| Jéssica Nascimento | 201806723 | up201806723@fe.up.pt |

----
## Project information

* Scale Factor available in the interface, so that it's possible to "zoom" to a section of the scene.
* Seven cameras to choose in the interface (two perspective and five orthogonal), showing all scene objects implemented.
* Four lights in the scene. They all start on but can be turned off/on at any time, one by one.
  - Two on the ceiling; 
  - One simulating light from the window;
  - One in one of the walls.

* Scene: [Relative link](TP2/scenes/LAIG_TP2_T2_G02.xml)
  - The scene represents an indoor swimming pool, more specifically the FADEUP swimming pool. 
  - The pool consists of 4 walls: one with a texture applied to simulate a dull glass window and the other three with a white or gray texture, with other textures overlapped to fill the walls.
  - The pool itself has 5 starting blocks, 5 lanes separated by 4 ropes and 2 sets of flags to mark the distance of 5 meters to each lane pool wall.
  - Now, we have one boat animation with a Portugal flag that completes 4x25m in 58 seconds.
  - One red animated hanging christmas ball, displaying "Merry Christmas" and moving for 2 minutes.
  - The wall clock with 4 pointers now has animation, also for 2 minutes.
  - One santa sprite animation (not visible on first camera: perfectly visible on [santaProjection](TP2/screenshots/santaProjection.png)).
  - One christmas song sprite text on the same wall as the clock (perfectly visible on [wallProjection](TP2/screenshots/wallProjection.png)).
  - The TV where the santa sprite animation is displayed uses a Plane primitive.
  - The olympics texture footer uses a Patch primitive.
  - The bowling pin on top of one of the pool blocks uses 2 Barrel primitives and 1 sphere.

  ![FirstCamera](TP2/screenshots/firstCamera.png)
  ![SecondCamera](TP2/screenshots/secondCamera.png)

----
## Issues/Problems

* Implementing transparancy for sprite animations.