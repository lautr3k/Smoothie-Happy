// Map all elements id to jQuery
// <div id="foo" /> => $foo
$('*[id]').each(function() {
  window['$' + this.id] = $(this);
});

// Compile template alias
function template(source) {
  return Handlebars.compile(source.html());
}

// Compiled template collection
var commandTemplate  = template($commandTemplate);
var responseTemplate = template($responseTemplate);
var retryTemplate    = template($retryTemplate);

Handlebars.registerHelper('seconds', function(data) {
  return data / 1000;
});

function jsonResponse(data) {
  var code = data;

  if (typeof code !== 'string') {
    code = JSON.stringify(code, null, ' ');
  }

  return responseTemplate({ code: code });
}

// -----------------------------------------------------------------------------

function scrollToBottom() {
  $('html, body').animate({ scrollTop: $(document).height() }, 500);
}

function fixBodyPosition() {
  $('.body').css({ marginTop: $('.navbar').height() + 15 });
}

$(window).resize(function() {
  fixBodyPosition();
})
.trigger('resize');

// -----------------------------------------------------------------------------

function updateCommandQueue(board) {
  if (board.address === $boardAddress.val()) {
    $commandQueue.html(board.commandQueue.length);

    var notEmpty = !!board.commandQueue.length

    $pauseCommandQueue.toggle(notEmpty && ! board.commandQueuePaused);
    $resumeCommandQueue.toggle(notEmpty && board.commandQueuePaused);
    $clearCommandQueue.toggle(notEmpty);
  }
}

// Populate $commandsNames input
commandsNames.forEach(function(commandName) {
  var $option  = $('<option />').text(commandName);
  var commands = SmoothieHappy.board.boardCommands;

  if (commandName.startsWith('config-')) {
    commandName = 'config_' + commandName.slice(7)
  }

  var disabled = commandName !== 'raw' && ! commands['cmd_' + commandName];

  $option.prop('disabled', disabled);
  $commandsNames.append($option);
});

// On command selected
$commandsNames.on('change', function(event) {
  var commandName = $commandsNames.find(':selected').text();
  var command     = commands[commandName];
  var placeholder = command.placeholder ? command.placeholder : 'No arguments...';

  $commandArgs.attr('title', placeholder).prop('disabled', !command.placeholder)
  .attr('placeholder', placeholder)
  .val(null);
});

// Send the command
$commandSend.on('click', function(event) {
  event.preventDefault();

  var commandName = $commandsNames.find(':selected').text();
  var commandArgs = $commandArgs.val();
  var commandLine = commandName;

  if (commandName === 'raw') {
    commandLine = commandArgs;
  }
  else if (commandArgs.length) {
    commandLine += ' ' + commandArgs;
  }

  if (commandLine.length < 2) {
    return null;
  }

  board.pushCommand(commandLine, { parseResponse: commandName !== 'raw' })
  // .then(function(event) {
  //   console.info('event:', event.data);
  // })
  // .catch(function(event) {
  //   console.error('error:', event);
  // });

  updateCommandQueue(board)
});

// ...
$pauseCommandQueue.on('click', function(event) {
  event.preventDefault();
  board.pauseCommandQueue();
  updateCommandQueue(board)
});

$resumeCommandQueue.on('click', function(event) {
  event.preventDefault();
  board.resumeCommandQueue();
  updateCommandQueue(board)
});

$clearCommandQueue.on('click', function(event) {
  event.preventDefault();
  board.clearCommandQueue();
  updateCommandQueue(board)
});

// ...
$('.clearState').on('click', function() {
  board.clearState();
})

// On board ip change
$boardAddress.on('change', function() {
  board = newBoard(this.value);
  updateCommandQueue(board)
})

// Populate board address
$boardAddress.val(storeGet('address'));
