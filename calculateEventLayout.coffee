class Events
	eventList: []
	constructor: (events) ->
		@addEvents(events)

	addEvent: (eventData) =>
		event = new Event eventData
		if event.initialized
			for current in @eventList
				if current.collides event
					current.splitArea()
					event.setSiblings current.siblingsCount
					event.pos = current.pos + 1
					event.recalculateWidth()
			@eventList.push event

	addEvents: (events) =>
		@addEvent(event) for event in events

	list: => @eventList.map (event)-> event.toResult()


class Event
	id            : 0
	siblingsCount : 0
	range         : [0, 0]
	maxWidth      : 600
	width         : 0
	height        : 0
	pos           : 0
	initialized   : false

	min: =>	@range[0]
	max: => @range[1]

	constructor: (data) ->
		return false if data.start > data.end
		@id        = data.id
		@range     = [data.start, data.end]
		@height    = data.end - data.start
		@recalculateWidth()
		@initialized = true;
	toResult: ->
		id    : @id
		start : @min()
		end   : @max()
		top   : @min()
		left  : @left()
		width : @width

	left: =>
		@pos * @width

	collides: (other) =>
		if @max() < other.min() || @min() > other.max()
			false
		else
			true

	splitArea: () =>
		@siblingsCount += 1
		@recalculateWidth()

	setSiblings: (@siblingsCount) =>

	recalculateWidth: =>
		if @siblingsCount > 0
			@width = @maxWidth / (@siblingsCount + 1)
		else
			@width = @maxWidth

layOutDay = (eventList) ->
	(new Events(eventList)).list()

console.log layOutDay([
	{ id : 1, start : 60, end : 120},
	{ id : 1, start : 60, end : 120},
	{ id : 2, start : 100, end : 240},
	{ id : 3, start : 700, end : 720},
	{ id : 3, start : 700, end : 720},
	{ id : 3, start : 700, end : 720},
	{ id : 3, start : 720, end : 720}
])