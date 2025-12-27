import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const IBG3DGallery = () => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentRelic, setCurrentRelic] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [isEntering, setIsEntering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);

  const relicInfo = {
    relic1: {
      title: "Relic I: Foundation",
      year: "2024",
      materials: "Heavyweight cotton, screen print",
      dimensions: "28 × 36 in.",
      description: "The origin piece. Triangle, circle, square rendered in gold on black. The geometry that grounds us."
    },
    relic2: {
      title: "Relic II: Inspired",
      year: "2024", 
      materials: "French terry, embroidered",
      dimensions: "32 × 44 in.",
      description: "The word made wearable. INSPIRED BY GOD across the chest. A declaration, not decoration."
    },
    relic3: {
      title: "Relic III: Sacred Geometry",
      year: "2024",
      materials: "Premium fleece, metallic thread",
      dimensions: "30 × 40 in.",
      description: "Oversized. Intentional. The three forms in gold, centered over the heart."
    },
    relic4: {
      title: "Relic IV: The Mark",
      year: "2024",
      materials: "Cotton blend, embossed",
      dimensions: "26 × 34 in.",
      description: "Minimal. The IBG lettermark alone. For those who know."
    },
    relic5: {
      title: "Relic V: Collection",
      year: "2024",
      materials: "Organic cotton, heritage print",
      dimensions: "34 × 46 in.",
      description: "Full expression. IBG COLLECTION rendered in chapel gold. The complete identity."
    },
    relic6: {
      title: "Relic VI: Future",
      year: "2024",
      materials: "Technical fabric, reflective ink",
      dimensions: "28 × 38 in.",
      description: "Forward facing. The geometry in silver. Clothing cultivated for what comes next."
    }
  };

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const framesRef = useRef([]);
  const keysRef = useRef({});
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const sculptureRef = useRef(null);

  const handleEnterGallery = () => {
    setIsEntering(true);
    setTimeout(() => {
      setShowIntro(false);
      setIsEntering(false);
    }, 100);
  };

  useEffect(() => {
    if (!containerRef.current || showIntro) return;

    let animationId;
    const frames = [];
    let hasEntered = false;
    
    const cameraStart = new THREE.Vector3(0, 1.7, 28);
    const cameraTarget = new THREE.Vector3(0, 1.7, 10);
    let cameraProgress = 0;

    const init = () => {
      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x080808);
      scene.fog = new THREE.FogExp2(0x080808, 0.015);
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(
        72,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        150
      );
      camera.position.copy(cameraStart);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.9;
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(ambientLight);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.08);
      hemiLight.position.set(0, 20, 0);
      scene.add(hemiLight);

      // Gallery dimensions
      const galleryLength = 50;
      const galleryWidth = 18;
      const galleryHeight = 7;

      // Build gallery
      createGalleryStructure(scene, galleryLength, galleryWidth, galleryHeight);

      // Create framed relics - IBG branded hoodies
      const relicPositions = [
        { x: -galleryWidth / 2 + 0.12, y: 2.6, z: -12, rotY: Math.PI / 2, scale: 1.15, id: 'relic1', design: 'geometry' },
        { x: -galleryWidth / 2 + 0.12, y: 2.6, z: 2, rotY: Math.PI / 2, scale: 1.3, id: 'relic2', design: 'inspired' },
        { x: -galleryWidth / 2 + 0.12, y: 2.6, z: 14, rotY: Math.PI / 2, scale: 1.1, id: 'relic3', design: 'largeGeo' },
        { x: galleryWidth / 2 - 0.12, y: 2.6, z: -12, rotY: -Math.PI / 2, scale: 1.0, id: 'relic4', design: 'ibgMark' },
        { x: galleryWidth / 2 - 0.12, y: 2.6, z: 2, rotY: -Math.PI / 2, scale: 1.35, id: 'relic5', design: 'collection' },
        { x: galleryWidth / 2 - 0.12, y: 2.6, z: 14, rotY: -Math.PI / 2, scale: 1.1, id: 'relic6', design: 'future' },
      ];

      relicPositions.forEach((pos) => {
        const frame = createFramedHoodie(pos.scale, pos.design, pos.id);
        frame.position.set(pos.x, pos.y, pos.z);
        frame.rotation.y = pos.rotY;
        frame.userData.relicId = pos.id;
        frames.push(frame);
        framesRef.current.push(frame);
        scene.add(frame);

        // Spotlight
        const spotlight = new THREE.SpotLight(0xfff8f0, 3);
        const spotX = pos.x > 0 ? pos.x - 2.5 : pos.x + 2.5;
        spotlight.position.set(spotX, 5.5, pos.z);
        spotlight.target = frame;
        spotlight.angle = Math.PI / 7;
        spotlight.penumbra = 0.6;
        spotlight.decay = 1.6;
        spotlight.distance = 14;
        spotlight.castShadow = true;
        spotlight.shadow.mapSize.width = 1024;
        spotlight.shadow.mapSize.height = 1024;
        scene.add(spotlight);
      });

      // Human-sized IBG Sculpture - the centerpiece
      const sculpture = createIBGSculpture(scene);
      sculptureRef.current = sculpture;

      // IBG Logo on back wall
      createIBGLogoOnWall(scene, 0, 4.2, -galleryLength / 2 + 0.12);

      // Gallery elements
      createGalleryElements(scene, galleryLength, galleryWidth, galleryHeight);

      // Entrance
      createEntrance(scene, galleryLength);

      setIsLoaded(true);
    };

    const createGalleryStructure = (scene, length, width, height) => {
      // Floor
      const floorGeometry = new THREE.PlaneGeometry(width + 4, length + 12);
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.2,
        metalness: 0.05
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = 0;
      floor.receiveShadow = true;
      scene.add(floor);

      // CEILING - Dark with visible structure
      const ceilingGeometry = new THREE.PlaneGeometry(width, length);
      const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.95
      });
      const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
      ceiling.rotation.x = Math.PI / 2;
      ceiling.position.y = height;
      scene.add(ceiling);

      // Ceiling grid structure
      const ceilingGridMaterial = new THREE.MeshStandardMaterial({
        color: 0x0f0f0f,
        roughness: 0.7,
        metalness: 0.3
      });

      // Main ceiling beams (running length of gallery)
      for (let x = -width/2 + 3; x <= width/2 - 3; x += 6) {
        const beam = new THREE.Mesh(
          new THREE.BoxGeometry(0.15, 0.2, length - 4),
          ceilingGridMaterial
        );
        beam.position.set(x, height - 0.1, 0);
        scene.add(beam);
      }

      // Cross beams
      for (let z = -length/2 + 5; z < length/2 - 3; z += 8) {
        const crossBeam = new THREE.Mesh(
          new THREE.BoxGeometry(width - 2, 0.1, 0.15),
          ceilingGridMaterial
        );
        crossBeam.position.set(0, height - 0.15, z);
        scene.add(crossBeam);
      }

      // TRACK LIGHTING SYSTEM
      const trackMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.4,
        metalness: 0.5
      });

      // Two main tracks running down the gallery
      for (let side = -1; side <= 1; side += 2) {
        const trackX = side * (width / 2 - 3);
        
        // Track rail
        const track = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.08, length - 8),
          trackMaterial
        );
        track.position.set(trackX, height - 0.35, 0);
        scene.add(track);

        // Light fixtures along track
        for (let z = -length/2 + 8; z < length/2 - 5; z += 6) {
          createTrackLight(scene, trackX, height - 0.4, z, side);
        }
      }

      // Center track for sculpture lighting
      const centerTrack = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.08, 12),
        trackMaterial
      );
      centerTrack.position.set(0, height - 0.35, 5);
      scene.add(centerTrack);

      // Add prominent ceiling spotlights
      createCeilingSpotlights(scene, length, width, height);

      // Walls
      const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xf8f8f6,
        roughness: 0.92
      });

      // Back wall
      const backWall = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMaterial);
      backWall.position.set(0, height / 2, -length / 2);
      backWall.receiveShadow = true;
      scene.add(backWall);

      // "INSPIRED BY GOD" text on back wall
      createInspiredByGodWallText(scene, 0, 5.5, -length / 2 + 0.1);

      // Front wall with opening
      const frontWallLeft = new THREE.Mesh(
        new THREE.PlaneGeometry(width / 2 - 2.5, height),
        wallMaterial
      );
      frontWallLeft.position.set(-width / 4 - 1.25, height / 2, length / 2);
      frontWallLeft.rotation.y = Math.PI;
      scene.add(frontWallLeft);

      const frontWallRight = new THREE.Mesh(
        new THREE.PlaneGeometry(width / 2 - 2.5, height),
        wallMaterial
      );
      frontWallRight.position.set(width / 4 + 1.25, height / 2, length / 2);
      frontWallRight.rotation.y = Math.PI;
      scene.add(frontWallRight);

      // Side walls
      const sideWallGeometry = new THREE.PlaneGeometry(length, height);
      
      const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
      leftWall.rotation.y = Math.PI / 2;
      leftWall.position.set(-width / 2, height / 2, 0);
      leftWall.receiveShadow = true;
      scene.add(leftWall);

      const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
      rightWall.rotation.y = -Math.PI / 2;
      rightWall.position.set(width / 2, height / 2, 0);
      rightWall.receiveShadow = true;
      scene.add(rightWall);

      // Baseboards
      const baseboardMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });
      
      const leftBaseboard = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, length), baseboardMaterial);
      leftBaseboard.position.set(-width/2 + 0.03, 0.09, 0);
      scene.add(leftBaseboard);

      const rightBaseboard = leftBaseboard.clone();
      rightBaseboard.position.x = width/2 - 0.03;
      scene.add(rightBaseboard);

      const backBaseboard = new THREE.Mesh(new THREE.BoxGeometry(width, 0.18, 0.06), baseboardMaterial);
      backBaseboard.position.set(0, 0.09, -length/2 + 0.03);
      scene.add(backBaseboard);
    };

    const createTrackLight = (scene, x, y, z, direction) => {
      const fixtureGroup = new THREE.Group();

      const blackMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.4,
        metalness: 0.5
      });

      // Fixture mount plate
      const mountPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.03, 0.15),
        blackMaterial
      );
      fixtureGroup.add(mountPlate);

      // Fixture arm
      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.3, 8),
        blackMaterial
      );
      arm.position.y = -0.15;
      fixtureGroup.add(arm);

      // Light housing (cylinder) - larger and more visible
      const housing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.12, 0.2, 16),
        blackMaterial
      );
      housing.position.y = -0.4;
      housing.rotation.x = direction * 0.4; // Angle toward walls
      fixtureGroup.add(housing);

      // Glowing light bulb/lens - VISIBLE GLOW
      const glowMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff8f0,
        emissive: 0xfff8f0,
        emissiveIntensity: 1.5,
        roughness: 0.05
      });
      
      // Inner lens
      const lens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.09, 0.05, 16),
        glowMaterial
      );
      lens.position.y = -0.52;
      lens.rotation.x = direction * 0.4;
      fixtureGroup.add(lens);

      // Outer glow ring
      const glowRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.08, 0.02, 8, 24),
        glowMaterial
      );
      glowRing.position.y = -0.53;
      glowRing.rotation.x = Math.PI / 2 + direction * 0.4;
      fixtureGroup.add(glowRing);

      // Add actual spotlight from this fixture - INCREASED
      const spotlight = new THREE.SpotLight(0xfff8f0, 3);
      spotlight.position.set(0, -0.55, 0);
      spotlight.angle = Math.PI / 5;
      spotlight.penumbra = 0.6;
      spotlight.decay = 1.2;
      spotlight.distance = 14;
      spotlight.castShadow = true;
      fixtureGroup.add(spotlight);
      
      // Point spotlight target toward the wall
      const targetObj = new THREE.Object3D();
      targetObj.position.set(direction * 5, -3, 0);
      fixtureGroup.add(targetObj);
      spotlight.target = targetObj;

      fixtureGroup.position.set(x, y, z);
      scene.add(fixtureGroup);
    };

    // Add prominent ceiling spotlights
    const createCeilingSpotlights = (scene, length, width, height) => {
      const spotlightPositions = [
        { x: 0, z: -15 },
        { x: 0, z: -5 },
        { x: 0, z: 5 },
        { x: 0, z: 15 },
        { x: -4, z: -10 },
        { x: 4, z: -10 },
        { x: -4, z: 10 },
        { x: 4, z: 10 },
      ];

      const blackMaterial = new THREE.MeshStandardMaterial({
        color: 0x0f0f0f,
        roughness: 0.5,
        metalness: 0.4
      });

      const glowMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff5e6,
        emissive: 0xfff5e6,
        emissiveIntensity: 1.5,
        roughness: 0.05
      });

      spotlightPositions.forEach(pos => {
        const fixtureGroup = new THREE.Group();

        // Recessed housing
        const housing = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.25, 0.15, 16),
          blackMaterial
        );
        housing.position.y = -0.08;
        fixtureGroup.add(housing);

        // Inner reflector
        const reflector = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.18, 0.12, 16),
          new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 })
        );
        reflector.position.y = -0.12;
        fixtureGroup.add(reflector);

        // Glowing bulb - LARGER
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 16, 16),
          glowMaterial
        );
        bulb.position.y = -0.15;
        fixtureGroup.add(bulb);

        // Outer glow halo - BRIGHTER
        const halo = new THREE.Mesh(
          new THREE.RingGeometry(0.12, 0.22, 24),
          new THREE.MeshStandardMaterial({
            color: 0xfff5e6,
            emissive: 0xfff5e6,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
          })
        );
        halo.rotation.x = Math.PI / 2;
        halo.position.y = -0.18;
        fixtureGroup.add(halo);

        fixtureGroup.position.set(pos.x, height, pos.z);
        scene.add(fixtureGroup);

        // Add actual light - INCREASED INTENSITY
        const light = new THREE.PointLight(0xfff5e6, 1.5, 12);
        light.position.set(pos.x, height - 0.3, pos.z);
        light.castShadow = true;
        scene.add(light);
      });
      
      // Add additional ambient ceiling glow
      const ceilingGlow = new THREE.PointLight(0xfff8f0, 0.4, 30);
      ceilingGlow.position.set(0, height - 1, 0);
      scene.add(ceilingGlow);
    };

    const createInspiredByGodWallText = (scene, x, y, z) => {
      const textGroup = new THREE.Group();

      const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xc9a962,
        roughness: 0.2,
        metalness: 0.65,
        emissive: 0x4a3d28,
        emissiveIntensity: 0.15
      });

      // "INSPIRED" - larger text representation
      const inspiredBar = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.12, 0.025),
        goldMaterial
      );
      inspiredBar.position.y = 0.15;
      textGroup.add(inspiredBar);

      // "BY" - smaller, centered
      const byBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.08, 0.02),
        goldMaterial
      );
      byBar.position.y = -0.05;
      textGroup.add(byBar);

      // "GOD" - medium
      const godBar = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.1, 0.022),
        goldMaterial
      );
      godBar.position.y = -0.25;
      textGroup.add(godBar);

      // Decorative line above
      const topLine = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.008, 0.01),
        goldMaterial
      );
      topLine.position.y = 0.4;
      textGroup.add(topLine);

      // Decorative line below
      const bottomLine = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.008, 0.01),
        goldMaterial
      );
      bottomLine.position.y = -0.45;
      textGroup.add(bottomLine);

      textGroup.position.set(x, y, z);
      scene.add(textGroup);

      // Spotlight for text
      const textSpot = new THREE.SpotLight(0xfff5e6, 2);
      textSpot.position.set(x, y + 1.5, z + 3);
      textSpot.target.position.set(x, y, z);
      textSpot.angle = Math.PI / 8;
      textSpot.penumbra = 0.5;
      scene.add(textSpot);
      scene.add(textSpot.target);
    };

    const createFramedHoodie = (scale, design, id) => {
      const group = new THREE.Group();

      const frameWidth = 1.5 * scale;
      const frameHeight = 2.0 * scale;
      const frameDepth = 0.1;
      const frameThickness = 0.08;

      // Shadow box frame
      const outerFrameGeometry = new THREE.BoxGeometry(frameWidth + 0.04, frameHeight + 0.04, frameDepth + 0.04);
      const outerFrameMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.15,
        metalness: 0.4
      });
      const outerFrame = new THREE.Mesh(outerFrameGeometry, outerFrameMaterial);
      outerFrame.castShadow = true;
      outerFrame.receiveShadow = true;
      group.add(outerFrame);

      // Inner frame
      const frameShape = new THREE.Shape();
      frameShape.moveTo(-frameWidth/2, -frameHeight/2);
      frameShape.lineTo(frameWidth/2, -frameHeight/2);
      frameShape.lineTo(frameWidth/2, frameHeight/2);
      frameShape.lineTo(-frameWidth/2, frameHeight/2);
      frameShape.lineTo(-frameWidth/2, -frameHeight/2);

      const innerHole = new THREE.Path();
      const innerW = frameWidth - frameThickness * 2;
      const innerH = frameHeight - frameThickness * 2;
      innerHole.moveTo(-innerW/2, -innerH/2);
      innerHole.lineTo(innerW/2, -innerH/2);
      innerHole.lineTo(innerW/2, innerH/2);
      innerHole.lineTo(-innerW/2, innerH/2);
      innerHole.lineTo(-innerW/2, -innerH/2);
      frameShape.holes.push(innerHole);

      const frameGeometry = new THREE.ExtrudeGeometry(frameShape, {
        depth: frameDepth,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelSegments: 2
      });

      const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.2,
        metalness: 0.35
      });

      const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
      frameMesh.position.z = 0.02;
      frameMesh.castShadow = true;
      group.add(frameMesh);

      // Mat
      const matGeometry = new THREE.BoxGeometry(innerW - 0.02, innerH - 0.02, 0.03);
      const matMaterial = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.95 });
      const mat = new THREE.Mesh(matGeometry, matMaterial);
      mat.position.z = 0.04;
      group.add(mat);

      // Glass
      const glassGeometry = new THREE.PlaneGeometry(innerW + 0.01, innerH + 0.01);
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.06,
        roughness: 0.05,
        metalness: 0.1,
        reflectivity: 0.35
      });
      const glass = new THREE.Mesh(glassGeometry, glassMaterial);
      glass.position.z = frameDepth + 0.02;
      group.add(glass);

      // Hoodie with IBG design
      const hoodie = createIBGHoodie(scale, design);
      hoodie.position.z = 0.06;
      group.add(hoodie);

      // IBG tag in corner
      const tagGroup = createIBGTag(scale * 0.08);
      tagGroup.position.set(innerW/2 - 0.08, -innerH/2 + 0.06, frameDepth + 0.025);
      group.add(tagGroup);

      return group;
    };

    const createIBGHoodie = (scale, design) => {
      const group = new THREE.Group();
      
      // Determine hoodie color based on design
      const colors = {
        geometry: 0x1a1a1a,      // Black
        inspired: 0x2a2a2a,      // Charcoal
        largeGeo: 0x0f0f0f,      // Deep black
        ibgMark: 0x252525,       // Dark gray
        collection: 0x1f1f1f,    // Off black
        future: 0x2d2d2d         // Medium gray
      };

      const hoodieColor = colors[design] || 0x1a1a1a;
      
      const hoodieMaterial = new THREE.MeshStandardMaterial({
        color: hoodieColor,
        roughness: 0.85,
        metalness: 0,
        side: THREE.DoubleSide
      });

      // Hood
      const hoodGeometry = new THREE.SphereGeometry(0.26 * scale, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
      const hood = new THREE.Mesh(hoodGeometry, hoodieMaterial);
      hood.position.y = 0.38 * scale;
      hood.rotation.x = Math.PI / 7;
      group.add(hood);

      // Hood opening (dark inside)
      const hoodInnerGeometry = new THREE.CircleGeometry(0.18 * scale, 20);
      const hoodInnerMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, side: THREE.DoubleSide });
      const hoodInner = new THREE.Mesh(hoodInnerGeometry, hoodInnerMaterial);
      hoodInner.position.set(0, 0.32 * scale, 0.12 * scale);
      hoodInner.rotation.x = -Math.PI / 5;
      group.add(hoodInner);

      // Body
      const bodyGeometry = new THREE.PlaneGeometry(0.65 * scale, 0.95 * scale);
      const body = new THREE.Mesh(bodyGeometry, hoodieMaterial);
      body.position.y = -0.15 * scale;
      group.add(body);

      // Kangaroo pocket
      const pocketGeometry = new THREE.PlaneGeometry(0.4 * scale, 0.18 * scale);
      const pocketMaterial = new THREE.MeshStandardMaterial({ color: 0x0f0f0f, roughness: 0.9 });
      const pocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
      pocket.position.set(0, -0.42 * scale, 0.004);
      group.add(pocket);

      // Drawstrings
      const stringMaterial = new THREE.MeshStandardMaterial({ color: 0x3a3a3a });
      const stringGeometry = new THREE.CylinderGeometry(0.005 * scale, 0.005 * scale, 0.22 * scale);
      const leftString = new THREE.Mesh(stringGeometry, stringMaterial);
      leftString.position.set(-0.06 * scale, 0.1 * scale, 0.008);
      group.add(leftString);
      const rightString = leftString.clone();
      rightString.position.x = 0.06 * scale;
      group.add(rightString);

      // Ribbing at bottom
      const ribbingGeometry = new THREE.PlaneGeometry(0.65 * scale, 0.04 * scale);
      const ribbingMaterial = new THREE.MeshStandardMaterial({ color: 0x151515 });
      const ribbing = new THREE.Mesh(ribbingGeometry, ribbingMaterial);
      ribbing.position.set(0, -0.6 * scale, 0.003);
      group.add(ribbing);

      // Add IBG branding based on design type
      const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xc9a962,
        roughness: 0.3,
        metalness: 0.5,
        emissive: 0x3d2f1a,
        emissiveIntensity: 0.1
      });

      const silverMaterial = new THREE.MeshStandardMaterial({
        color: 0xc0c0c0,
        roughness: 0.25,
        metalness: 0.7
      });

      if (design === 'geometry' || design === 'largeGeo') {
        // Triangle, Circle, Square logo
        const logoScale = design === 'largeGeo' ? 0.12 : 0.08;
        const logoY = design === 'largeGeo' ? 0.05 : 0.1;

        // Triangle
        const triShape = new THREE.Shape();
        triShape.moveTo(0, 0.08 * scale * logoScale * 10);
        triShape.lineTo(-0.06 * scale * logoScale * 10, -0.04 * scale * logoScale * 10);
        triShape.lineTo(0.06 * scale * logoScale * 10, -0.04 * scale * logoScale * 10);
        triShape.lineTo(0, 0.08 * scale * logoScale * 10);
        const triGeo = new THREE.ShapeGeometry(triShape);
        const triangle = new THREE.Mesh(triGeo, goldMaterial);
        triangle.position.set(-0.12 * scale, logoY * scale, 0.006);
        group.add(triangle);

        // Circle
        const circleGeo = new THREE.RingGeometry(0.03 * scale * logoScale * 10, 0.045 * scale * logoScale * 10, 24);
        const circle = new THREE.Mesh(circleGeo, goldMaterial);
        circle.position.set(0, logoY * scale, 0.006);
        group.add(circle);

        // Square
        const sqShape = new THREE.Shape();
        sqShape.moveTo(-0.04 * scale * logoScale * 10, -0.04 * scale * logoScale * 10);
        sqShape.lineTo(0.04 * scale * logoScale * 10, -0.04 * scale * logoScale * 10);
        sqShape.lineTo(0.04 * scale * logoScale * 10, 0.04 * scale * logoScale * 10);
        sqShape.lineTo(-0.04 * scale * logoScale * 10, 0.04 * scale * logoScale * 10);
        const sqHole = new THREE.Path();
        sqHole.moveTo(-0.025 * scale * logoScale * 10, -0.025 * scale * logoScale * 10);
        sqHole.lineTo(0.025 * scale * logoScale * 10, -0.025 * scale * logoScale * 10);
        sqHole.lineTo(0.025 * scale * logoScale * 10, 0.025 * scale * logoScale * 10);
        sqHole.lineTo(-0.025 * scale * logoScale * 10, 0.025 * scale * logoScale * 10);
        sqShape.holes.push(sqHole);
        const sqGeo = new THREE.ShapeGeometry(sqShape);
        const square = new THREE.Mesh(sqGeo, goldMaterial);
        square.position.set(0.12 * scale, logoY * scale, 0.006);
        group.add(square);

      } else if (design === 'inspired') {
        // "INSPIRED BY GOD" text representation (horizontal bars)
        const textMaterial = goldMaterial;
        
        // Main text bar
        const mainBar = new THREE.Mesh(
          new THREE.PlaneGeometry(0.4 * scale, 0.025 * scale),
          textMaterial
        );
        mainBar.position.set(0, 0.12 * scale, 0.006);
        group.add(mainBar);

        // Secondary bar
        const secBar = new THREE.Mesh(
          new THREE.PlaneGeometry(0.25 * scale, 0.015 * scale),
          textMaterial
        );
        secBar.position.set(0, 0.08 * scale, 0.006);
        group.add(secBar);

      } else if (design === 'ibgMark') {
        // Simple IBG lettermark (three vertical bars)
        const barWidth = 0.025 * scale;
        const barHeight = 0.08 * scale;
        const spacing = 0.05 * scale;

        for (let i = -1; i <= 1; i++) {
          const bar = new THREE.Mesh(
            new THREE.PlaneGeometry(barWidth, barHeight),
            goldMaterial
          );
          bar.position.set(i * spacing, 0.1 * scale, 0.006);
          group.add(bar);
        }

        // Connecting bar at top
        const topBar = new THREE.Mesh(
          new THREE.PlaneGeometry(0.12 * scale, 0.012 * scale),
          goldMaterial
        );
        topBar.position.set(0, 0.14 * scale, 0.006);
        group.add(topBar);

      } else if (design === 'collection') {
        // "IBG COLLECTION" - logo + text bar
        // Small geometry logo
        const smallTri = new THREE.Mesh(
          new THREE.CircleGeometry(0.02 * scale, 3),
          goldMaterial
        );
        smallTri.rotation.z = Math.PI;
        smallTri.position.set(-0.1 * scale, 0.14 * scale, 0.006);
        group.add(smallTri);

        const smallCircle = new THREE.Mesh(
          new THREE.RingGeometry(0.012 * scale, 0.02 * scale, 16),
          goldMaterial
        );
        smallCircle.position.set(0, 0.14 * scale, 0.006);
        group.add(smallCircle);

        const smallSquare = new THREE.Mesh(
          new THREE.PlaneGeometry(0.035 * scale, 0.035 * scale),
          goldMaterial
        );
        smallSquare.position.set(0.1 * scale, 0.14 * scale, 0.006);
        group.add(smallSquare);

        // Collection text bar
        const collBar = new THREE.Mesh(
          new THREE.PlaneGeometry(0.32 * scale, 0.018 * scale),
          goldMaterial
        );
        collBar.position.set(0, 0.06 * scale, 0.006);
        group.add(collBar);

      } else if (design === 'future') {
        // Silver/reflective geometry
        // Triangle
        const futTri = new THREE.Mesh(
          new THREE.CircleGeometry(0.04 * scale, 3),
          silverMaterial
        );
        futTri.rotation.z = Math.PI;
        futTri.position.set(-0.1 * scale, 0.1 * scale, 0.006);
        group.add(futTri);

        // Circle
        const futCircle = new THREE.Mesh(
          new THREE.RingGeometry(0.025 * scale, 0.04 * scale, 24),
          silverMaterial
        );
        futCircle.position.set(0, 0.1 * scale, 0.006);
        group.add(futCircle);

        // Square
        const futSqOuter = new THREE.Shape();
        futSqOuter.moveTo(-0.035 * scale, -0.035 * scale);
        futSqOuter.lineTo(0.035 * scale, -0.035 * scale);
        futSqOuter.lineTo(0.035 * scale, 0.035 * scale);
        futSqOuter.lineTo(-0.035 * scale, 0.035 * scale);
        const futSqInner = new THREE.Path();
        futSqInner.moveTo(-0.02 * scale, -0.02 * scale);
        futSqInner.lineTo(0.02 * scale, -0.02 * scale);
        futSqInner.lineTo(0.02 * scale, 0.02 * scale);
        futSqInner.lineTo(-0.02 * scale, 0.02 * scale);
        futSqOuter.holes.push(futSqInner);
        const futSquare = new THREE.Mesh(new THREE.ShapeGeometry(futSqOuter), silverMaterial);
        futSquare.position.set(0.1 * scale, 0.1 * scale, 0.006);
        group.add(futSquare);
      }

      return group;
    };

    const createIBGSculpture = (scene) => {
      // Human-sized sculpture: Triangle, Circle, Square - ALL HOLLOW/OUTLINE STYLE
      const sculptureGroup = new THREE.Group();
      
      const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xc9a962,
        roughness: 0.2,
        metalness: 0.7,
        emissive: 0x4a3d28,
        emissiveIntensity: 0.08
      });

      const blackMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.3,
        metalness: 0.4
      });

      // Wide base platform
      const baseGeometry = new THREE.BoxGeometry(6, 0.12, 1.8);
      const base = new THREE.Mesh(baseGeometry, blackMaterial);
      base.position.y = 0.06;
      base.castShadow = true;
      base.receiveShadow = true;
      sculptureGroup.add(base);

      // Gold accent line on base
      const baseAccent = new THREE.Mesh(
        new THREE.BoxGeometry(5.8, 0.02, 0.04),
        goldMaterial
      );
      baseAccent.position.set(0, 0.13, 0.85);
      sculptureGroup.add(baseAccent);

      // TRIANGLE - Hollow outline like circle and square
      const triangleGroup = new THREE.Group();
      
      const triHeight = 1.4;
      const triWidth = 0.8;
      const triThickness = 0.07; // Tube thickness like circle
      const triDepth = 0.07;

      // Create hollow triangle using three cylinder edges
      const edgeLength1 = Math.sqrt(Math.pow(triWidth/2, 2) + Math.pow(triHeight, 2)); // Side edges
      const edgeLength2 = triWidth; // Bottom edge

      // Left edge
      const leftEdge = new THREE.Mesh(
        new THREE.CylinderGeometry(triThickness, triThickness, edgeLength1, 12),
        goldMaterial
      );
      leftEdge.position.set(-triWidth/4, 0, 0);
      leftEdge.rotation.z = Math.atan2(triHeight, triWidth/2) - Math.PI/2;
      leftEdge.castShadow = true;
      triangleGroup.add(leftEdge);

      // Right edge
      const rightEdge = new THREE.Mesh(
        new THREE.CylinderGeometry(triThickness, triThickness, edgeLength1, 12),
        goldMaterial
      );
      rightEdge.position.set(triWidth/4, 0, 0);
      rightEdge.rotation.z = -(Math.atan2(triHeight, triWidth/2) - Math.PI/2);
      rightEdge.castShadow = true;
      triangleGroup.add(rightEdge);

      // Bottom edge
      const bottomEdge = new THREE.Mesh(
        new THREE.CylinderGeometry(triThickness, triThickness, triWidth, 12),
        goldMaterial
      );
      bottomEdge.position.set(0, -triHeight/2, 0);
      bottomEdge.rotation.z = Math.PI/2;
      bottomEdge.castShadow = true;
      triangleGroup.add(bottomEdge);

      // Corner spheres for smooth joints
      const cornerGeo = new THREE.SphereGeometry(triThickness, 12, 12);
      const topCorner = new THREE.Mesh(cornerGeo, goldMaterial);
      topCorner.position.set(0, triHeight/2, 0);
      triangleGroup.add(topCorner);

      const leftCorner = new THREE.Mesh(cornerGeo, goldMaterial);
      leftCorner.position.set(-triWidth/2, -triHeight/2, 0);
      triangleGroup.add(leftCorner);

      const rightCorner = new THREE.Mesh(cornerGeo, goldMaterial);
      rightCorner.position.set(triWidth/2, -triHeight/2, 0);
      triangleGroup.add(rightCorner);

      // Individual pedestal for triangle
      const triPedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.5, 0.18, 24),
        blackMaterial
      );
      triPedestal.position.y = -triHeight / 2 - 0.15;
      triangleGroup.add(triPedestal);

      triangleGroup.position.set(-2, triHeight / 2 + 0.35, 0);
      sculptureGroup.add(triangleGroup);

      // CIRCLE - Torus ring (unchanged, already hollow)
      const circleGroup = new THREE.Group();
      
      const circleRadius = 0.5;
      const tubeRadius = 0.07;
      
      const torusGeometry = new THREE.TorusGeometry(circleRadius, tubeRadius, 16, 48);
      const circle = new THREE.Mesh(torusGeometry, goldMaterial);
      circle.castShadow = true;
      circleGroup.add(circle);

      // Individual pedestal for circle
      const circlePedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.5, 0.18, 24),
        blackMaterial
      );
      circlePedestal.position.y = -circleRadius - 0.15;
      circleGroup.add(circlePedestal);

      circleGroup.position.set(0, circleRadius + 0.35, 0);
      sculptureGroup.add(circleGroup);

      // SQUARE - Hollow outline
      const squareGroup = new THREE.Group();
      
      const sqSize = 1.0;
      const sqThickness = 0.07; // Match tube thickness

      // Four edges as cylinders
      const sqEdge = new THREE.CylinderGeometry(sqThickness, sqThickness, sqSize, 12);

      // Top edge
      const topEdge = new THREE.Mesh(sqEdge, goldMaterial);
      topEdge.rotation.z = Math.PI/2;
      topEdge.position.y = sqSize/2;
      topEdge.castShadow = true;
      squareGroup.add(topEdge);

      // Bottom edge
      const botEdge = new THREE.Mesh(sqEdge, goldMaterial);
      botEdge.rotation.z = Math.PI/2;
      botEdge.position.y = -sqSize/2;
      botEdge.castShadow = true;
      squareGroup.add(botEdge);

      // Left edge
      const leftSqEdge = new THREE.Mesh(sqEdge, goldMaterial);
      leftSqEdge.position.x = -sqSize/2;
      leftSqEdge.castShadow = true;
      squareGroup.add(leftSqEdge);

      // Right edge
      const rightSqEdge = new THREE.Mesh(sqEdge, goldMaterial);
      rightSqEdge.position.x = sqSize/2;
      rightSqEdge.castShadow = true;
      squareGroup.add(rightSqEdge);

      // Corner spheres
      const sqCornerGeo = new THREE.SphereGeometry(sqThickness, 12, 12);
      const corners = [
        [-sqSize/2, sqSize/2],
        [sqSize/2, sqSize/2],
        [-sqSize/2, -sqSize/2],
        [sqSize/2, -sqSize/2]
      ];
      corners.forEach(([x, y]) => {
        const corner = new THREE.Mesh(sqCornerGeo, goldMaterial);
        corner.position.set(x, y, 0);
        squareGroup.add(corner);
      });

      // Individual pedestal for square
      const sqPedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.5, 0.18, 24),
        blackMaterial
      );
      sqPedestal.position.y = -sqSize / 2 - 0.15;
      squareGroup.add(sqPedestal);

      squareGroup.position.set(2, sqSize / 2 + 0.35, 0);
      sculptureGroup.add(squareGroup);

      // Position sculpture in gallery
      sculptureGroup.position.set(0, 0, 5);
      scene.add(sculptureGroup);

      // Individual spotlights for each shape
      const triSpot = new THREE.SpotLight(0xfff8f0, 3);
      triSpot.position.set(-2, 5, 5);
      triSpot.target.position.set(-2, 1, 5);
      triSpot.angle = Math.PI / 8;
      triSpot.penumbra = 0.5;
      triSpot.castShadow = true;
      scene.add(triSpot);
      scene.add(triSpot.target);

      const circleSpot = new THREE.SpotLight(0xfff8f0, 3);
      circleSpot.position.set(0, 5, 5);
      circleSpot.target.position.set(0, 1, 5);
      circleSpot.angle = Math.PI / 8;
      circleSpot.penumbra = 0.5;
      circleSpot.castShadow = true;
      scene.add(circleSpot);
      scene.add(circleSpot.target);

      const sqSpot = new THREE.SpotLight(0xfff8f0, 3);
      sqSpot.position.set(2, 5, 5);
      sqSpot.target.position.set(2, 1, 5);
      sqSpot.angle = Math.PI / 8;
      sqSpot.penumbra = 0.5;
      sqSpot.castShadow = true;
      scene.add(sqSpot);
      scene.add(sqSpot.target);

      return sculptureGroup;
    };

    const createIBGTag = (size) => {
      const group = new THREE.Group();
      const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xc9a962,
        roughness: 0.28,
        metalness: 0.55
      });

      // Triangle
      const triGeo = new THREE.CircleGeometry(0.04, 3);
      const triangle = new THREE.Mesh(triGeo, goldMaterial);
      triangle.rotation.z = Math.PI;
      triangle.position.x = -0.12;
      triangle.scale.setScalar(size * 10);
      group.add(triangle);

      // Circle
      const circleGeo = new THREE.RingGeometry(0.025, 0.04, 16);
      const circle = new THREE.Mesh(circleGeo, goldMaterial);
      circle.scale.setScalar(size * 10);
      group.add(circle);

      // Square
      const sqShape = new THREE.Shape();
      sqShape.moveTo(-0.035, -0.035);
      sqShape.lineTo(0.035, -0.035);
      sqShape.lineTo(0.035, 0.035);
      sqShape.lineTo(-0.035, 0.035);
      const sqHole = new THREE.Path();
      sqHole.moveTo(-0.02, -0.02);
      sqHole.lineTo(0.02, -0.02);
      sqHole.lineTo(0.02, 0.02);
      sqHole.lineTo(-0.02, 0.02);
      sqShape.holes.push(sqHole);
      const square = new THREE.Mesh(new THREE.ShapeGeometry(sqShape), goldMaterial);
      square.position.x = 0.12;
      square.scale.setScalar(size * 10);
      group.add(square);

      return group;
    };

    const createIBGLogoOnWall = (scene, x, y, z) => {
      const group = new THREE.Group();
      
      const backingGeometry = new THREE.PlaneGeometry(3.5, 1.4);
      const backingMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.8 });
      const backing = new THREE.Mesh(backingGeometry, backingMaterial);
      backing.position.z = -0.02;
      group.add(backing);

      const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xc9a962,
        roughness: 0.22,
        metalness: 0.6,
        emissive: 0x4a3d28,
        emissiveIntensity: 0.1
      });

      // Triangle - SOLID
      const triangleShape = new THREE.Shape();
      triangleShape.moveTo(0, 0.45);
      triangleShape.lineTo(-0.35, -0.25);
      triangleShape.lineTo(0.35, -0.25);
      triangleShape.lineTo(0, 0.45);
      const triangleGeometry = new THREE.ExtrudeGeometry(triangleShape, {
        depth: 0.03,
        bevelEnabled: true,
        bevelThickness: 0.006,
        bevelSize: 0.006
      });
      const triangle = new THREE.Mesh(triangleGeometry, goldMaterial);
      triangle.position.x = -1.1;
      group.add(triangle);

      // Circle
      const circleGeometry = new THREE.TorusGeometry(0.28, 0.06, 14, 32);
      const circle = new THREE.Mesh(circleGeometry, goldMaterial);
      circle.position.z = 0.015;
      group.add(circle);

      // Square
      const squareOuter = new THREE.Shape();
      squareOuter.moveTo(-0.34, -0.34);
      squareOuter.lineTo(0.34, -0.34);
      squareOuter.lineTo(0.34, 0.34);
      squareOuter.lineTo(-0.34, 0.34);
      const squareInner = new THREE.Path();
      squareInner.moveTo(-0.2, -0.2);
      squareInner.lineTo(0.2, -0.2);
      squareInner.lineTo(0.2, 0.2);
      squareInner.lineTo(-0.2, 0.2);
      squareOuter.holes.push(squareInner);
      const squareGeometry = new THREE.ExtrudeGeometry(squareOuter, {
        depth: 0.03,
        bevelEnabled: true,
        bevelThickness: 0.006,
        bevelSize: 0.006
      });
      const square = new THREE.Mesh(squareGeometry, goldMaterial);
      square.position.x = 1.1;
      group.add(square);

      group.position.set(x, y, z);
      scene.add(group);

      // Logo light
      const logoLight = new THREE.SpotLight(0xfff5e6, 2);
      logoLight.position.set(x, y + 2, z + 3);
      logoLight.target.position.set(x, y, z);
      logoLight.angle = Math.PI / 6;
      logoLight.penumbra = 0.5;
      scene.add(logoLight);
      scene.add(logoLight.target);
    };

    const createGalleryElements = (scene, length, width, height) => {
      // Benches - positioned to not block sculpture view
      createBench(scene, -3.5, -8);
      createBench(scene, 3.5, -8);
    };

    const createBench = (scene, x, z) => {
      const benchGroup = new THREE.Group();

      const seatGeometry = new THREE.BoxGeometry(2.4, 0.08, 0.55);
      const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.35, metalness: 0.1 });
      const seat = new THREE.Mesh(seatGeometry, seatMaterial);
      seat.position.y = 0.44;
      seat.castShadow = true;
      seat.receiveShadow = true;
      benchGroup.add(seat);

      const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.4, metalness: 0.6 });
      const legGeometry = new THREE.BoxGeometry(0.04, 0.44, 0.45);
      const leftLeg = new THREE.Mesh(legGeometry, frameMaterial);
      leftLeg.position.set(-1, 0.22, 0);
      benchGroup.add(leftLeg);

      const rightLeg = leftLeg.clone();
      rightLeg.position.x = 1;
      benchGroup.add(rightLeg);

      benchGroup.position.set(x, 0, z);
      scene.add(benchGroup);
    };

    const createEntrance = (scene, galleryLength) => {
      const hallLength = 10;
      const hallWidth = 5;
      const hallHeight = 4.5;

      const hallMaterial = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.9 });

      const hallFloor = new THREE.Mesh(new THREE.PlaneGeometry(hallWidth, hallLength), hallMaterial);
      hallFloor.rotation.x = -Math.PI / 2;
      hallFloor.position.set(0, 0.01, galleryLength / 2 + hallLength / 2);
      scene.add(hallFloor);

      const hallCeiling = new THREE.Mesh(new THREE.PlaneGeometry(hallWidth, hallLength), hallMaterial);
      hallCeiling.rotation.x = Math.PI / 2;
      hallCeiling.position.set(0, hallHeight, galleryLength / 2 + hallLength / 2);
      scene.add(hallCeiling);

      const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.85 });

      const hallLeftWall = new THREE.Mesh(new THREE.PlaneGeometry(hallLength, hallHeight), wallMaterial);
      hallLeftWall.rotation.y = Math.PI / 2;
      hallLeftWall.position.set(-hallWidth / 2, hallHeight / 2, galleryLength / 2 + hallLength / 2);
      scene.add(hallLeftWall);

      const hallRightWall = new THREE.Mesh(new THREE.PlaneGeometry(hallLength, hallHeight), wallMaterial);
      hallRightWall.rotation.y = -Math.PI / 2;
      hallRightWall.position.set(hallWidth / 2, hallHeight / 2, galleryLength / 2 + hallLength / 2);
      scene.add(hallRightWall);

      const entranceLight = new THREE.PointLight(0xfff5e6, 0.3, 6);
      entranceLight.position.set(0, 3, galleryLength / 2 + 4);
      scene.add(entranceLight);
    };

    // Event handlers
    const onKeyDown = (e) => { keysRef.current[e.code] = true; };
    const onKeyUp = (e) => { keysRef.current[e.code] = false; };

    const onMouseDown = (e) => {
      if (e.button === 0) {
        isDraggingRef.current = true;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
        containerRef.current.style.cursor = 'grabbing';
      }
    };

    const onMouseUp = (e) => {
      if (e.button === 0) {
        const dx = Math.abs(e.clientX - lastMouseRef.current.x);
        const dy = Math.abs(e.clientY - lastMouseRef.current.y);
        
        if (dx < 5 && dy < 5 && hasEntered) {
          const raycaster = new THREE.Raycaster();
          const mouse = new THREE.Vector2(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1
          );
          raycaster.setFromCamera(mouse, cameraRef.current);
          
          const intersects = raycaster.intersectObjects(framesRef.current, true);
          if (intersects.length > 0) {
            let obj = intersects[0].object;
            while (obj.parent && !obj.userData.relicId) {
              obj = obj.parent;
            }
            if (obj.userData.relicId && relicInfo[obj.userData.relicId]) {
              setCurrentRelic(relicInfo[obj.userData.relicId]);
            }
          } else {
            setCurrentRelic(null);
          }
        }
        
        isDraggingRef.current = false;
        containerRef.current.style.cursor = 'grab';
      }
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current || !hasEntered) return;
      
      const deltaX = e.clientX - lastMouseRef.current.x;
      const deltaY = e.clientY - lastMouseRef.current.y;
      
      yawRef.current -= deltaX * 0.003;
      pitchRef.current -= deltaY * 0.003;
      pitchRef.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitchRef.current));
      
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseLeave = () => {
      isDraggingRef.current = false;
      if (containerRef.current) containerRef.current.style.cursor = 'grab';
    };

    const onResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;

      if (!camera || !renderer || !scene) return;

      // Entry animation
      if (!hasEntered && cameraProgress < 1) {
        cameraProgress += 0.005;
        const eased = 1 - Math.pow(1 - cameraProgress, 3);
        camera.position.lerpVectors(cameraStart, cameraTarget, eased);
        camera.lookAt(0, 1.8, 0);
        
        if (cameraProgress >= 1) {
          hasEntered = true;
          setShowControls(true);
        }
      }

      // Movement
      if (hasEntered) {
        const speed = 0.1;
        const direction = new THREE.Vector3();

        const forward = new THREE.Vector3(Math.sin(yawRef.current), 0, -Math.cos(yawRef.current));
        const right = new THREE.Vector3(Math.cos(yawRef.current), 0, Math.sin(yawRef.current));

        if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) direction.add(forward);
        if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) direction.sub(forward);
        if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) direction.sub(right);
        if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) direction.add(right);

        if (direction.length() > 0) {
          direction.normalize().multiplyScalar(speed);
          camera.position.add(direction);
          camera.position.x = Math.max(-7.5, Math.min(7.5, camera.position.x));
          camera.position.z = Math.max(-23, Math.min(22, camera.position.z));
        }

        camera.rotation.order = 'YXZ';
        camera.rotation.y = yawRef.current;
        camera.rotation.x = pitchRef.current;
      }

      // Subtle sculpture breathing animation
      if (sculptureRef.current) {
        sculptureRef.current.children.forEach((child, i) => {
          if (child.position.y > 0.5) {
            child.position.y = child.userData.baseY || child.position.y;
            if (!child.userData.baseY) child.userData.baseY = child.position.y;
            child.position.y = child.userData.baseY + Math.sin(Date.now() * 0.001 + i) * 0.01;
          }
        });
      }

      // Frame animation
      framesRef.current.forEach((frame, i) => {
        if (frame) {
          frame.position.y = 2.6 + Math.sin(Date.now() * 0.0005 + i * 0.8) * 0.005;
        }
      });

      renderer.render(scene, camera);
    };

    init();
    animate();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);
    
    if (containerRef.current) {
      containerRef.current.addEventListener('mousedown', onMouseDown);
      containerRef.current.addEventListener('mouseup', onMouseUp);
      containerRef.current.addEventListener('mousemove', onMouseMove);
      containerRef.current.addEventListener('mouseleave', onMouseLeave);
      containerRef.current.style.cursor = 'grab';
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onResize);
      
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousedown', onMouseDown);
        containerRef.current.removeEventListener('mouseup', onMouseUp);
        containerRef.current.removeEventListener('mousemove', onMouseMove);
        containerRef.current.removeEventListener('mouseleave', onMouseLeave);
        if (rendererRef.current?.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      rendererRef.current?.dispose();
    };
  }, [showIntro]);

  // ORIGINAL INTRO SCREEN WITH FLOATING ANIMATION
  // Custom cursor handler
  const handleIntroMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    if (!cursorVisible) setCursorVisible(true);
  };

  const handleIntroMouseLeave = () => {
    setCursorVisible(false);
  };

  // Custom cursor component
  const CustomCursor = () => (
    <div 
      className="fixed pointer-events-none z-50 transition-transform duration-75"
      style={{ 
        left: cursorPos.x, 
        top: cursorPos.y,
        transform: 'translate(-50%, -50%)',
        opacity: cursorVisible ? 1 : 0
      }}
    >
      {/* Triangle */}
      <svg viewBox="0 0 30 30" className="absolute w-5 h-5 animate-cursor-orbit" style={{ animationDelay: '0s' }}>
        <polygon points="15,3 27,25 3,25" fill="none" stroke="#c9a962" strokeWidth="1.5"/>
      </svg>
      {/* Circle */}
      <div className="absolute w-4 h-4 border border-amber-600 rounded-full animate-cursor-orbit" style={{ animationDelay: '0.15s' }} />
      {/* Square */}
      <div className="absolute w-3.5 h-3.5 border border-amber-600 animate-cursor-orbit" style={{ animationDelay: '0.3s' }} />
      {/* Center dot */}
      <div className="absolute w-1.5 h-1.5 bg-amber-600 rounded-full" style={{ transform: 'translate(-50%, -50%)' }} />
    </div>
  );

  const IntroScreen = () => (
    <div 
      className={`absolute inset-0 bg-stone-950 flex flex-col items-center justify-center z-20 transition-opacity duration-1000 cursor-none ${isEntering ? 'opacity-0' : 'opacity-100'}`}
      onMouseMove={handleIntroMouseMove}
      onMouseLeave={handleIntroMouseLeave}
    >
      {/* Custom Cursor */}
      <CustomCursor />
      <div className="absolute inset-0 overflow-hidden">
        {/* Pulsing circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96">
          <div className="absolute inset-0 border border-amber-600/30 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute inset-12 border border-amber-600/20 rounded-full animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
          <div className="absolute inset-24 border border-amber-600/10 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '1s' }} />
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-[12%] left-[8%] animate-float-drift">
          <svg viewBox="0 0 50 50" className="w-14 h-14 opacity-25">
            <polygon points="25,5 45,42 5,42" fill="none" stroke="#c9a962" strokeWidth="1"/>
          </svg>
        </div>
        <div className="absolute top-[18%] right-[12%] animate-float-drift-reverse">
          <div className="w-12 h-12 border border-amber-600/25 rounded-full" />
        </div>
        <div className="absolute bottom-[22%] left-[15%] animate-float-drift" style={{ animationDelay: '1s' }}>
          <div className="w-10 h-10 border border-amber-600/20" />
        </div>
        <div className="absolute bottom-[28%] right-[8%] animate-float-drift-reverse" style={{ animationDelay: '0.5s' }}>
          <svg viewBox="0 0 40 40" className="w-10 h-10 opacity-20">
            <polygon points="20,4 36,34 4,34" fill="none" stroke="#c9a962" strokeWidth="1"/>
          </svg>
        </div>
        <div className="absolute top-[45%] left-[5%] animate-float-drift" style={{ animationDelay: '1.5s' }}>
          <div className="w-8 h-8 border border-amber-600/15 rounded-full" />
        </div>
        <div className="absolute top-[55%] right-[6%] animate-float-drift-reverse" style={{ animationDelay: '2s' }}>
          <div className="w-7 h-7 border border-amber-600/15" />
        </div>
        <div className="absolute bottom-[12%] left-[35%] animate-float-drift" style={{ animationDelay: '0.8s' }}>
          <div className="w-5 h-5 border border-amber-600/20 rounded-full" />
        </div>
        <div className="absolute top-[8%] right-[30%] animate-float-drift-reverse" style={{ animationDelay: '1.2s' }}>
          <div className="w-6 h-6 border border-amber-600/15" />
        </div>
        <div className="absolute bottom-[35%] right-[25%] animate-float-drift" style={{ animationDelay: '0.3s' }}>
          <svg viewBox="0 0 30 30" className="w-8 h-8 opacity-15">
            <polygon points="15,3 27,25 3,25" fill="none" stroke="#c9a962" strokeWidth="1"/>
          </svg>
        </div>
        <div className="absolute top-[35%] left-[18%] animate-float-drift-reverse" style={{ animationDelay: '1.8s' }}>
          <div className="w-4 h-4 border border-amber-600/20 rounded-full" />
        </div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-1 bg-amber-600/40 rounded-full animate-float-particle"
            style={{
              left: `${8 + (i * 6) % 84}%`,
              top: `${12 + (i * 5.5) % 76}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${5 + (i % 4)}s`
            }}
          />
        ))}
        
        {/* Vertical lines */}
        <div className="absolute inset-0 flex justify-around opacity-5">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-px h-full bg-gradient-to-b from-transparent via-amber-600 to-transparent" />
          ))}
        </div>
      </div>
      
      <div className="relative z-10 text-center px-6">
        {/* Floating IBG Logo */}
        <div className="flex items-center justify-center gap-5 mb-8 animate-float-gentle">
          {/* Triangle - floating */}
          <div className="w-10 h-10 relative animate-float-slow">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <polygon points="20,4 36,36 4,36" fill="none" stroke="#c9a962" strokeWidth="2"/>
            </svg>
          </div>
          {/* Circle - floating with offset */}
          <div className="w-10 h-10 border-2 border-amber-600 rounded-full animate-float-medium" />
          {/* Square - floating with different offset */}
          <div className="w-10 h-10 border-2 border-amber-600 animate-float-fast" />
        </div>
        
        <h1 className="text-5xl font-extralight tracking-[0.4em] text-stone-100 mb-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>IBG</h1>
        <p className="text-sm tracking-[0.3em] text-amber-600 mb-1 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>COLLECTION</p>
        <p className="text-xs tracking-[0.2em] text-stone-500 italic mb-10 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>c/o Inspired by God</p>
        
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600/60 to-transparent mx-auto mb-10 animate-expand" style={{ animationDelay: '0.8s' }} />
        
        <p className="text-3xl font-extralight tracking-[0.25em] text-stone-200 mb-4 animate-fade-in-up" style={{ animationDelay: '1s' }}>OPTIC RELICS</p>
        <p className="text-sm tracking-[0.12em] text-stone-500 max-w-md mx-auto leading-relaxed mb-12 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          Clothing cultivated for the future. Memory preserved in fabric. Identity framed as fine art.
        </p>
        
        <button
          onClick={handleEnterGallery}
          className="group px-10 py-4 border border-amber-600/60 text-amber-500 text-sm tracking-[0.25em] hover:bg-amber-600/10 hover:border-amber-600 transition-all duration-500 relative overflow-hidden animate-fade-in-up"
          style={{ animationDelay: '1.4s' }}
        >
          <span className="relative z-10">ENTER GALLERY</span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/10 to-amber-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </button>
        
        <p className="text-xs text-stone-600 mt-10 tracking-wider animate-fade-in-up" style={{ animationDelay: '1.6s' }}>Los Angeles | 2026</p>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden select-none">
      {showIntro && <IntroScreen />}
      
      {!showIntro && (
        <>
          <div ref={containerRef} className="w-full h-full" />
          
          <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-start pointer-events-none">
            <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded">
              <p className="text-xs tracking-[0.25em] text-stone-400">IBG COLLECTION</p>
              <p className="text-base tracking-wider text-stone-200 font-light">Optic Relics</p>
            </div>
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded">
              <svg viewBox="0 0 20 20" className="w-4 h-4">
                <polygon points="10,2 18,18 2,18" fill="none" stroke="#c9a962" strokeWidth="1.5"/>
              </svg>
              <div className="w-4 h-4 border-2 border-amber-600 rounded-full" />
              <div className="w-4 h-4 border-2 border-amber-600" />
            </div>
          </div>
          
          {currentRelic && (
            <div className="absolute bottom-24 left-6 bg-white/95 backdrop-blur-sm p-6 max-w-sm shadow-2xl rounded animate-fade-in">
              <button onClick={() => setCurrentRelic(null)} className="absolute top-3 right-4 text-stone-400 hover:text-stone-600 text-xl font-light">×</button>
              <p className="text-lg font-medium text-stone-800 mb-1">{currentRelic.title}</p>
              <p className="text-xs text-stone-500 mb-3">{currentRelic.year} | {currentRelic.materials} | {currentRelic.dimensions}</p>
              <p className="text-sm text-stone-600 leading-relaxed mb-4">{currentRelic.description}</p>
              <div className="pt-3 border-t border-stone-200">
                <p className="text-xs text-stone-400 tracking-wider">IBG COLLECTION c/o INSPIRED BY GOD</p>
              </div>
            </div>
          )}
          
          {showControls && !currentRelic && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-6 py-3 rounded pointer-events-none">
              <div className="flex items-center gap-6 text-xs text-stone-300 tracking-wider">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="px-2 py-1 bg-stone-700/50 rounded text-[10px]">W</span>
                    <span className="px-2 py-1 bg-stone-700/50 rounded text-[10px]">A</span>
                    <span className="px-2 py-1 bg-stone-700/50 rounded text-[10px]">S</span>
                    <span className="px-2 py-1 bg-stone-700/50 rounded text-[10px]">D</span>
                  </div>
                  <span className="text-stone-500">Move</span>
                </div>
                <div className="w-px h-4 bg-stone-600" />
                <span className="text-stone-500">Click + drag to look</span>
                <div className="w-px h-4 bg-stone-600" />
                <span className="text-stone-500">Click relic for info</span>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-6 right-6 pointer-events-none">
            <p className="text-xs text-stone-500 tracking-wider bg-black/40 backdrop-blur-sm px-3 py-1 rounded">position.gallery</p>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30">
            <div className="w-6 h-6 border border-stone-400 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-stone-400 rounded-full" />
          </div>

          {!isLoaded && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-stone-700 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs text-stone-500 tracking-wider">Preparing gallery...</p>
              </div>
            </div>
          )}
        </>
      )}
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { 
          opacity: 0;
          animation: fade-in-up 0.8s ease-out forwards; 
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        .animate-float-medium { animation: float-medium 3.5s ease-in-out infinite 0.3s; }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(-2deg); }
        }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite 0.6s; }
        
        @keyframes expand {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }
        .animate-expand { 
          opacity: 0;
          animation: expand 1s ease-out forwards; 
        }
        
        @keyframes float-drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -15px) rotate(3deg); }
          50% { transform: translate(-5px, -25px) rotate(-2deg); }
          75% { transform: translate(-15px, -10px) rotate(2deg); }
        }
        .animate-float-drift { animation: float-drift 8s ease-in-out infinite; }
        
        @keyframes float-drift-reverse {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-12px, -18px) rotate(-3deg); }
          50% { transform: translate(8px, -22px) rotate(2deg); }
          75% { transform: translate(15px, -8px) rotate(-2deg); }
        }
        .animate-float-drift-reverse { animation: float-drift-reverse 9s ease-in-out infinite; }
        
        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          25% { transform: translate(20px, -30px); opacity: 0.6; }
          50% { transform: translate(-10px, -50px); opacity: 0.3; }
          75% { transform: translate(-25px, -20px); opacity: 0.5; }
        }
        .animate-float-particle { animation: float-particle 6s ease-in-out infinite; }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-gentle { animation: float-gentle 4s ease-in-out infinite; }
        
        @keyframes cursor-orbit {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(12px) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(12px) rotate(-360deg); }
        }
        .animate-cursor-orbit { 
          animation: cursor-orbit 3s linear infinite;
          transform-origin: center center;
        }
      `}</style>
    </div>
  );
};

export default IBG3DGallery;
