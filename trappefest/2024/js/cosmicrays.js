function startCosmicRays() {
  document.querySelector("body").classList.add("cosmicRays");
  var blobCount = 5;
  function randy(min, max) {
    return Math.floor(Math.random() * (1 + max - min) + min);
  }
  var time = 60,
    tl = new TimelineMax({ repeat: -1, yoyo: false }),
    container = document.getElementById("cosmicRays");
  for (var i = 0; i < blobCount; i++) {
    var div = document.createElement("div");
    container.appendChild(div);
  }

  var blobs = container.children;

  initSettings = [];

  for (var i = 0; i < blobs.length; i++) {
    var init = {};
    init.rot = randy(-2500, 2500);
    init.rotX = randy(-2500, 2500);
    init.rotY = randy(-2500, 2500);
    init.rotZ = randy(-2500, 2500);
    init.left = randy(-40, 130) + "%";
    init.top = randy(-40, 130) + "%";
    init.width = randy(50, 100) + "%";
    init.height = randy(50, 100) + "%";
    initSettings.push(init);
    tl.set(blobs[i], {
      rotation: init.rot,
      rotationX: init.rotX,
      rotationY: init.rotY,
      rotationZ: init.rotZ,
      left: init.left,
      top: init.top,
      width: init.width,
      height: init.height,
    });
  }
  for (var i = 0; i < blobs.length; i++) {
    tl.to(
      blobs[i],
      time * 6,
      {
        rotation: "+=" + 3600,
        rotationX: "+=" + 3600,
        rotationY: "+=" + 3600,
        rotationZ: "+=" + 3600,
        ease: Power0.easeNone,
        width: "100%",
        height: "100%",
      },
      0
    );
  }
  for (var i = 0; i < blobs.length; i++) {
    tl.to(
      blobs[i],
      time * 2,
      {
        left: randy(-40, 130) + "%",
        ease: Sine.easeInOut,
      },
      0
    );
  }
  for (var i = 0; i < blobs.length; i++) {
    tl.to(
      blobs[i],
      time,
      {
        top: randy(-40, 130) + "%",
        ease: Sine.easeInOut,
      },
      0
    );
  }
  for (var i = 0; i < blobs.length; i++) {
    tl.to(
      blobs[i],
      time * 2,
      {
        top: randy(-40, 130) + "%",
        ease: Sine.easeInOut,
      },
      time
    );
  }
  for (var i = 0; i < blobs.length; i++) {
    tl.to(
      blobs[i],
      time * 2,
      {
        left: randy(-40, 130) + "%",
        ease: Sine.easeInOut,
      },
      time * 2
    );
  }
  for (var i = 0; i < blobs.length; i++) {
    tl.to(
      blobs[i],
      time * 2,
      {
        top: randy(-40, 130) + "%",
        ease: Sine.easeInOut,
      },
      time * 3
    );
  }
  for (var i = 0; i < blobs.length; i++) {
    tl.to(
      blobs[i],
      time * 2,
      {
        left: initSettings[i].left,
        ease: Sine.easeInOut,
      },
      time * 4
    );
  }
  for (var i = 0; i < blobs.length; i++) {
    tl.to(
      blobs[i],
      time,
      {
        top: initSettings[i].top,
        ease: Sine.easeInOut,
      },
      time * 5
    );
  }
}

document.addEventListener("DOMContentLoaded", startCosmicRays);
