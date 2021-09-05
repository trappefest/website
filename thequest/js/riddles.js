function checkRiddles(button) {
  if(button.id == "next"){
    next();
    return;
  }
  var input = button.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling
  var text = input.value.toLowerCase()
  switch (input.id) {
    case "r1":
      if (text == "cliffhanger") {
        next();
        return;
      }
      break;
    case "r2":
      if (text == "fading away" || text == "fade away") {
        next();
        return;
      }
      break;
    case "r3":
      if (text == "headquarter" || text == "headquarters") {
        next();
        return;
      }
      break;
    case "r4":
      if (text == "i stand corrected") {
        next();
        return;
      }
      break;
    case "r5":
      if (text == "through thick and thin") {
        next();
        return;
      }
      break;
    case "r6":
      if (text == "red herring") {
        next();
        return;
      }
      break;
    case "r7":
      if (text == "pirate ship") {
        next();
        return;
      }
      break;
    case "r8":
      if (text == "mismatch") {
        next();
        return;
      }
      break;
    case "r9":
      if (text == "back to square one") {
        next();
        return;
      }
      break;
    case "r10":
      if (text == "left for dead") {
        next();
        return;
      }
      break;
    case "r11":
      if (text == "make ends meet" || text == "to make ends meet") {
        next();
        return;
      }
      break;
    case "r12":
      if (text == "holy water") {
        next();
        return;
      }
      break;
    case "r13":
      if (text == "stakes are high" || text == "the stakes are high") {
        next();
        return;
      }
      break;
    case "r14":
      if (text == "eye candy") {
        next();
        return;
      }
      break;
    case "r18":
      if (text == "yes uk massive") {
        next();
        return;
      }
      break;
    case "r17":
      if (text == "torne") {
        next();
        return;
      }
      break;
  }
  input.classList.add("is-invalid");
}

function next() {
  $("#carouselRiddles").carousel('next')
  $("#carouselRiddles").carousel('pause')
}

function clearInput(input) {
  input.classList.remove("is-invalid");
}
