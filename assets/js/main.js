var authHeader;
var inputs = {
  TOKEN: document.querySelector("#token"),
  CHANNELS: document.querySelector("#channels"),
  MESSAGE: document.querySelector("#message"),
  SUBMIT: document.querySelector("#submit"),
};

function disableInputs() {
  Object.keys(inputs).map(function (input) {
    inputs[input].disabled = true;
  });
}

function enableInputs() {
  Object.keys(inputs).map(function (input) {
    inputs[input].disabled = false;
  });
}

function loadInputs() {
  if (localStorage.getItem("token"))
    inputs.TOKEN.value = localStorage.getItem("token");
  if (localStorage.getItem("channels"))
    inputs.CHANNELS.value = localStorage.getItem("channels");
  if (localStorage.getItem("message"))
    inputs.MESSAGE.value = localStorage.getItem("message");
}

function parseChannels(channels) {
  return channels.split(",");
}

function saveInputs() {
  localStorage.setItem("token", inputs.TOKEN.value);
  localStorage.setItem("channels", inputs.CHANNELS.value);
  localStorage.setItem("message", inputs.MESSAGE.value);
}

function sendMessages() {
  var channels = parseChannels(inputs.CHANNELS.value);
  var completedChannels = 0;

  disableInputs();
  inputs.SUBMIT.value = "Sending Messages... (0/" + channels.length + ")";

  channels.map(async function (channelId) {
    try {
      await api.sendMessage(channelId, inputs.MESSAGE.value);
      completedChannels++;

      console.log(`Sent message to channel with ID '${channelId}'`);
    } catch (error) {
      completedChannels++;

      console.error(`Failed to send message to channel with ID '${channelId}'`);
    }

    inputs.SUBMIT.value =
      "Sending Messages... (" + completedChannels + "/" + channels.length + ")";

    if (completedChannels === channels.length) {
      enableInputs();
      inputs.SUBMIT.value = "Send Messages";
    }
  });
}

function submitForm() {
  authHeader = inputs.TOKEN.value;

  saveInputs();
  sendMessages();
}

loadInputs();
