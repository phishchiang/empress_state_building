
let camera, scene, renderer;
let mixers = [];
let clock = new THREE.Clock();
let time = 0;
let building_a01Group = new THREE.Group();
let building_a01_gridGroup = new THREE.Group();
let building_a01_gridFrontGroup = new THREE.Group();
let building_a01_armatureGroup = new THREE.Group();
let building_a01_fenceGroup = new THREE.Group();
// let building_a01Group = new THREE.Group();
// let building_a01Group = new THREE.Group();
// let building_a01Group = new THREE.Group();
let dirLight_main;
let dirLight_back;
let carWorldPosition;

let mouse, raycaster;
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();
let intersectObjs = [];


init();
animate();


function init(){
  scene = new THREE.Scene();

  scene.background = new THREE.Color(0x454545);
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.9 );
  hemiLight.color.setHSL( 0.6, 1, 0.6 );
  // hemiKolor = new THREE.Color( 0x9fc2f9 );
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set( 0, 50, 0 );
  scene.add( hemiLight );

  // hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
  // scene.add( hemiLightHelper );
  
  // DirLight Main
  dirLight_main = new THREE.DirectionalLight( 0xf7f7e3,  1.5 );
  dirLight_main.color.setHSL( 0.1, 1, 0.95 );
  dirLight_main.position.set( 1, 1.75, -1 );
  dirLight_main.position.multiplyScalar( 30 );
  scene.add( dirLight_main );
  dirLight_main.castShadow = true;

  // dirLight_mainHeper = new THREE.DirectionalLightHelper( dirLight_main, 10 );
  // scene.add( dirLight_mainHeper );

  // DirLight Back
  dirLight_back = new THREE.DirectionalLight( 0x94b9ce,  0.3 );
  // dirLight_back.color.setHSL( 0.1, 1, 0.95 );
  dirLight_back.position.set( -0.6, 1.75, 1.2 );
  dirLight_back.position.multiplyScalar( 30 );
  scene.add( dirLight_back );
  dirLight_back.castShadow = true;

  // dirLight_backHeper = new THREE.DirectionalLightHelper( dirLight_back, 10 );
  // scene.add( dirLight_backHeper );

  let controls = new THREE.OrbitControls(camera, renderer.domElement)
  camera.position.set( 139.61, 97.08, 59.32 );
  controls.update()
  
  
  //FBX import
  let fbxLoader = new THREE.FBXLoader();
  
  
  // building_a01 GEO
  scene.add( building_a01Group );
  fbxLoader.load( './resource/models/fbx/building_a01.fbx', function ( fbx ) {
    // building_a01 Texture
    let txtLoader = new THREE.TextureLoader();
    let textureMapColor = txtLoader.load( './resource/textures/EGKK_London_Empress_State_Albedo.png' );
    let textureMapRough = txtLoader.load( './resource/textures/EGKK_London_Empress_State_Rough.jpg' );
    let textureMapNormal = txtLoader.load( './resource/textures/EGKK_London_Empress_State_NormalMap.png' );
    let textureMapEmi = txtLoader.load( './resource/textures/EGKK_London_Empress_State_Emission.png' );
    // let textureMapRough = txtLoader.load( './resource/textures/EGKK_London_Empress_State_Gloss.png' );

    fbx.mixer = new THREE.AnimationMixer( fbx );
    let mesh = fbx.children[0];
    mesh.material = new THREE.MeshStandardMaterial({ 
      map: textureMapColor, 
      roughnessMap: textureMapRough,
      normalMap:textureMapNormal,
      emissiveMap:textureMapEmi,
      emissive:0x9b9b96,
      metalness:0,
      roughness:1,
    });

    fbx.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
        intersectObjs.push(child);
      }
    });
    // console.log(fbx);
    building_a01Group.add( fbx );
  });
  // building_a01Group.rotation.set(0, -90*Math.PI/180, 0);
  // building_a01Group.position.set(5,0,10);

  // building_a01_grid GEO
  scene.add( building_a01_gridGroup );
  fbxLoader.load( './resource/models/fbx/building_a01_grid.fbx', function ( fbx ) {
    
    let txtLoader = new THREE.TextureLoader();
    let textureMapRough = txtLoader.load( './resource/texturesEGKK_London_Empress_State_fence_Rough.jpg' );
    let textureMapNormal = txtLoader.load( './resource/textures/EGKK_London_Empress_State_fence_NormalMap.png' );
    let textureMapOpacity = txtLoader.load( './resource/textures/EGKK_London_Empress_State_fence_Opacity.png' );

    fbx.mixer = new THREE.AnimationMixer( fbx );
    let mesh = fbx.children[0];
    mesh.material = new THREE.MeshStandardMaterial({ 
      color:0x96927f,
      roughnessMap: textureMapRough,
      normalMap:textureMapNormal,
      alphaMap:textureMapOpacity,
      metalness:0,
      roughness:1,
    });
    mesh.material.transparent = true;

    fbx.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
        intersectObjs.push(child);
      }
    });
    console.log(fbx);
    building_a01_gridGroup.add( fbx );
  });

  // building_a01_gridFront GEO
  scene.add( building_a01_gridFrontGroup );
  fbxLoader.load( './resource/models/fbx/building_a01_gridFront.fbx', function ( fbx ) {

    let txtLoader = new THREE.TextureLoader();
    let textureMapRough = txtLoader.load( './resource/texturesEGKK_London_Empress_State_fence_Rough.jpg' );
    let textureMapNormal = txtLoader.load( './resource/textures/EGKK_London_Empress_State_fence_NormalMap.png' );
    let textureMapOpacity = txtLoader.load( './resource/textures/EGKK_London_Empress_State_fence_Opacity.png' );

    fbx.mixer = new THREE.AnimationMixer( fbx );
    let mesh = fbx.children[0];
    mesh.material = new THREE.MeshStandardMaterial({ 
      color:0x96927f,
      roughnessMap: textureMapRough,
      normalMap:textureMapNormal,
      alphaMap:textureMapOpacity,
      metalness:0,
      roughness:1,
    });
    mesh.material.transparent = true;

    fbx.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
        intersectObjs.push(child);
      }
    });
    console.log(fbx);
    building_a01_gridFrontGroup.add( fbx );
  });
  
  // building_a01_armature GEO
  scene.add( building_a01_armatureGroup );
  fbxLoader.load( './resource/models/fbx/building_a01_armature.fbx', function ( fbx ) {

    let txtLoader = new THREE.TextureLoader();
    let textureMapRough = txtLoader.load( './resource/texturesEGKK_London_Empress_State_fence_Rough.jpg' );
    let textureMapNormal = txtLoader.load( './resource/textures/EGKK_London_Empress_State_fence_NormalMap.png' );
    let textureMapOpacity = txtLoader.load( './resource/textures/EGKK_London_Empress_State_fence_Opacity.png' );

    fbx.mixer = new THREE.AnimationMixer( fbx );
    let mesh = fbx.children[0];
    mesh.material = new THREE.MeshStandardMaterial({ 
      color:0x96927f,
      roughnessMap: textureMapRough,
      normalMap:textureMapNormal,
      alphaMap:textureMapOpacity,
      metalness:0,
      roughness:1,
    });
    mesh.material.transparent = true;

    fbx.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
        intersectObjs.push(child);
      }
    });
    console.log(fbx);
    building_a01_armatureGroup.add( fbx );
  });
  
  // building_a01_fence GEO
  scene.add( building_a01_fenceGroup );
  fbxLoader.load( './resource/models/fbx/building_a01_fence.fbx', function ( fbx ) {

    let txtLoader = new THREE.TextureLoader();
    let textureMapRough = txtLoader.load( './resource/texturesEGKK_London_Empress_State_fence_Rough.jpg' );
    let textureMapNormal = txtLoader.load( './resource/textures/EGKK_London_Empress_State_fence_NormalMap.png' );
    let textureMapOpacity = txtLoader.load( './resource/textures/EGKK_London_Empress_State_fence_Opacity.png' );

    fbx.mixer = new THREE.AnimationMixer( fbx );
    let mesh = fbx.children[0];
    mesh.material = new THREE.MeshStandardMaterial({ 
      color:0x96927f,
      roughnessMap: textureMapRough,
      normalMap:textureMapNormal,
      alphaMap:textureMapOpacity,
      metalness:0,
      roughness:1,
    });
    mesh.material.transparent = true;

    fbx.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
        intersectObjs.push(child);
      }
    });
    console.log(fbx);
    building_a01_fenceGroup.add( fbx );
  });
  
  
  scene.updateMatrixWorld(true);
  
  
  // let threeJsCube = new THREE.Mesh( geometry, material );
  
  // document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
  requestAnimationFrame(animate);
  time += clock.getDelta();
  TWEEN.update();
  renderer.render( scene, camera );
}
