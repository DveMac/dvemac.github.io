(function (doc) {

    const results = doc.querySelector('#results')
    const dobInput = doc.querySelector('input.dob')
    const nextBdayPanel = doc.querySelector('#next-bday')
    const cleave = new Cleave('.dob', {date: true, datePattern: ['m', 'd', 'Y']})

    function update() {
        const val = cleave.getFormattedValue()
        const dob = moment(val)
        if (val.length < 8) return render({})
        if (val.length !== 10) return
        if (!dob.isValid()) return render({errors: 'Date is valid'})
        const dayDiff = moment().diff(dob, 'days')
        const bdays = getMathBdays(dayDiff)
        const next = bdays.reduce(function (m, o) {
            return m || (o.position === 0 ? o : m)
        }, undefined)
        render({bdays: bdays, next: next})
    }

    function render(data) {
        results.innerHTML = ''
        results.classList.add('hidden')
        nextBdayPanel.classList.add('hidden')
        if (data.bdays) {
            nextBdayPanel.innerText = getPositionDesc(data.next)
            nextBdayPanel.classList.remove('hidden')
            data.bdays.forEach(function (e, i) {
                results.appendChild(createTimelineEntry(e, i))
            })
            results.classList.remove('hidden')
        }
    }

    function getPositionDesc(data) {
        if (!data) return 'Your next Math Birthday could not be calculated!'
        switch (data.position) {
            case -1:
                return `It was your ${data.bday}-day-old Math Birthday ${data.diffDesc} ago, on ${data.date}.`
            case 0:
                return data.diff === 0
                    ? `It's your ${data.bday}-day-old birthday today! Happy Math Birthday!`
                    : `Your next math birthday is your ${data.bday}-day-old birthday on ${data.date} - that's in ${data.diffDesc}.`
            case 1:
                return `On ${data.date} it will be your ${data.bday}-day-old Math Birthday.`
        }
    }

    function createTimelineEntry(data, idx) {
        const type = data.position === 0 ? (data.diff === 0 ? 'warning' : 'info') : (data.position < 0 ? 'success' : '')
        const desc = data.position < 0 ? data.diffDesc + ' ago' : 'in ' + data.diffDesc
        const icon = data.diff === 0 ? 'glyphicon-star' : 'glyphicon-check'
        const position = idx % 2 ? 'timeline-inverted' : ''
        const html = `<li class="${position} ${ data.position === 0 ? 'next' : ''}">
            <div class="timeline-badge ${type}"><i class="glyphicon ${icon}"></i></div>
              <div class="timeline-panel">
                <div class="timeline-heading">
                  <h4 class="timeline-title">${data.date}</h4>
                  <p><small class="text-muted"><i class="glyphicon glyphicon-time"></i> ${desc} </small></p>
                </div>
                <div class="timeline-body">
                    <h5>${data.bday}-day Math Birthday</h5>
                    <p>${ getPositionDesc(data) }</p>
                </div>
              </div>
            </li>`
        const d = doc.createElement('div');
        d.innerHTML = html
        return d.firstChild
    }

    function getMathBdays(diff) {
        var bdays = [], pow = 1, next = 10, position

        while (next <= 10000000) {
            if (diff >= Math.pow(10, pow - 1) && next >= diff) position = 0
            else if (next >= diff) position = 1
            else position = -1
            bdays.push({
                bday: next,
                position: position,
                diff: next - diff,
                diffDesc: moment.duration(next - diff, "days").humanize(),
                date: moment().add(next - diff, 'days').format('dddd, MMMM Do YYYY')
            })
            next = Math.pow(10, ++pow)
        }

        return bdays
    }

    dobInput.addEventListener('keyup', update)

    update()

}(document))