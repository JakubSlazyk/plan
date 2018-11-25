function getPlan() {
    fetch("../plann", {
        cache: "no-cache",
        pragma: "no-cache",
        "cache-control": "no-cache"
    }).then((response) => response.json())
        .then((planJson) => {
            console.log(planJson.events);
            $('#calendar').fullCalendar({
                theme: true,
                businessHours: true,
                editable: true,
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                events: planJson.events,
                eventClick: openModal
            });
        });
}
function openModal(event) {
    console.log(event);
    $('#exampleModal').modal('show');
    $('#exampleModalLabel').text(event.title);
    let eventStart = new Date(event.start._i);
    let eventEnd = new Date(event.end._i);
    console.log(event.start._i);
    console.log(event.end._i);
    $('#modal-text').text(`${eventStart.getFullYear()}.${eventStart.getMonth()}.${eventStart.getDate()} ${eventStart.getHours()}:${eventStart.getMinutes()}-${eventEnd.getHours()}:${eventEnd.getMinutes()}\n`);
    $("#datepicker").datepicker();
}
function refreshPlan() {
    fetch("../plann", {
        cache: "no-cache",
        pragma: "no-cache",
        "cache-control": "no-cache"
    }).then((response) => response.json())
        .then((planJson) => {
            $('#calendar').fullCalendar('removeEvents');
            planJson.events.forEach((event) => {
                $('#calendar').fullCalendar('renderEvent', event);
            });
        });
}