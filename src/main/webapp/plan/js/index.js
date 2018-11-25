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
    $('#modal-text').text(`Stara data: ${eventStart.getFullYear()}.${eventStart.getMonth()}.${eventStart.getDate()} ${eventStart.getHours()}:${eventStart.getMinutes()}-${eventEnd.getHours()}:${eventEnd.getMinutes()}\n`);
    $("#datepicker").datepicker();
    $('#event-id').text(event._id);
}
function przelozZajecia() {
    let blok = $('#blockpicker').val();
    let data = $("#datepicker").val();
    let startDate = new Date(data);
    let endDate = new Date(data);
    switch (blok) {
        case "1":
            startDate.setHours(8);
            startDate.setMinutes(0);
            endDate.setHours(9);
            endDate.setMinutes(35);
            break;
        case "2":
            startDate.setHours(9);
            startDate.setMinutes(50);
            endDate.setHours(11);
            endDate.setMinutes(25);
            break;
        case "3":
            startDate.setHours(11);
            startDate.setMinutes(40);
            endDate.setHours(13);
            endDate.setMinutes(15);
            break;
        case "4":
            startDate.setHours(13);
            startDate.setMinutes(30);
            endDate.setHours(15);
            endDate.setMinutes(5);
            break;
        case "5":
            startDate.setHours(15);
            startDate.setMinutes(45);
            endDate.setHours(17);
            endDate.setMinutes(20);
            break;
        case "6":
            startDate.setHours(17);
            startDate.setMinutes(35);
            endDate.setHours(19);
            endDate.setMinutes(10);
            break;
        case "7":
            startDate.setHours(19);
            startDate.setMinutes(25);
            endDate.setHours(21);
            endDate.setMinutes(0);
            break;

    }
    startDate.setHours(startDate.getHours() + 1);
    endDate.setHours(endDate.getHours() + 1);
    startDate = startDate.toISOString().slice(0, startDate.toISOString().length - 1);
    endDate = endDate.toISOString(0, endDate.toISOString().length - 1);
    console.log(startDate);
    console.log(endDate);
    fetchPlan().then((json) => {
        json.events[$('#event-id').text() - 1].start = startDate;
        json.events[$('#event-id').text() - 1].end = endDate;
        console.log(json);
        uploadPlan(json).then(() => {
            refreshPlan();
        })
    })
    // let eventToChange = $('#calendar').fullCalendar('clientEvents', $('#event-id').text())[0];
    // let elementToDelete;
    // events = events.slice(elementToDelete, 1);
    // eventToChange

}

function refreshPlan() {
    fetch("../plann", {
        cache: "no-cache",
        pragma: "no-cache",
        "cache-control": "no-cache",
    }).then((response) => response.json())
        .then((planJson) => {
            $('#calendar').fullCalendar('removeEvents');
            planJson.events.forEach((event) => {
                $('#calendar').fullCalendar('renderEvent', event);
            });
        });
}
function fetchPlan() {
    return fetch("../plann", {
        cache: "no-cache",
        pragma: "no-cache",
        "cache-control": "no-cache"
    }).then((response) => response.json());
}

function uploadPlan(plan) {
    return fetch("../plann", {
        method: 'post',
        cache: "no-cache",
        pragma: "no-cache",
        "cache-control": "no-cache",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(plan)
    });
}