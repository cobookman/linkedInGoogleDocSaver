window.scraper = {
    profile: function() {
        var experience = this.scrapeExperience();
        var education = this.scrapeEducation();
        var connections = this.scrapeConnections();
        var fullname = this.scrapeName();

        return {
            id: this.id(),
            url: document.URL,
            experience: this.formatExperience(experience),
            experience_list: experience,
            years_of_experience: this.yearsOfExperience(experience),
            summary: this.scrapeSummary(),
            name: fullname,
            first_name: fullname.split(' ')[0],
            education_name: education.name,
            education_degree: education.degree,
            education_major: education.major,
            education_start: education.start,
            education_end: education.end,
            connections_names: connections.names,
            connections_number: connections.number
        };
    },

    scrapeExperience: function() {
        var expEl = document.getElementById('background-experience');
        if(!expEl) {
            return;
        }

        var experienceList = expEl.querySelectorAll('div.section-item');
        var output = [];

        for(var i = 0, l = experienceList.length; i < l; ++i) {
            var experience = experienceList[i];

            var title = this.textContent(experience.querySelector('a[name=title]'));

            var rawTime = this.textContent(experience.querySelector('.experience-date-locale'));
            var time = rawTime.slice(rawTime.indexOf('(')+1, rawTime.indexOf(')'));

            // grab last h5
            var companyEls = experience.querySelectorAll('h5');
            var company = this.textContent(companyEls.length && companyEls[companyEls.length-1]);

            var descriptionEl = experience.querySelector('.description');
            var description = this.textContent(descriptionEl);

            // only log non-intern positions
            if(!this.isIntern(title, description)) {
                output.push({
                    title: title,
                    company: company,
                    time: time,
                    description: description
                });
            }
        }
        return output;
    },

    scrapeSummary: function() {
        return this.textContent(document.querySelector('#summary-item-view p.description'));
    },

    scrapeName: function() {
        return this.textContent(document.querySelector('#name span.full-name'));
    },

    scrapeEducation: function() {
        var educationEl = document.querySelector('.education.first');
        var educationDate= this.textContent(educationEl.querySelector('.education-date'));
        var educationTimeRange = educationDate.split(' ');

        return {
            name: this.textContent(educationEl.querySelector('h4.org')),
            degree: this.textContent(educationEl.querySelector('.degree')),
            major: this.textContent(educationEl.querySelector('.major')),
            start: educationTimeRange[0],
            end: educationTimeRange[2]
        };
    },

    scrapeConnections: function() {
        var connectionEl = document.getElementById('connections');

        // parse out the number of 2nd connections
        var number = 0;
        if(connectionEl) {
            number = this.textContent(connectionEl.querySelector('.shared'));
            number = number.slice(number.indexOf('(') +1, number.indexOf(')'));
        }
        // parse out the list of the displayed connections
        var connectionsEl = document.querySelectorAll('a.connections-name');
        var names = '';
        for(var i = 0, l = connectionsEl.length; i < l; ++i) {
            names += connectionsEl[i].textContent + '\n';
        }

        // remove trailing newline
        names  = names.slice(0, -1);

        return {
            names: names,
            number: number
        };
    },

    textContent: function(domElm) {
        if(domElm && domElm.textContent) {
            return domElm.textContent;
        } else {
            return '';
        }
    },

    isIntern: function() {
        for(var i = 0, l = arguments.length; i < l; ++i) {
            if(typeof arguments[i] === 'string' && (arguments[i].toLowerCase().indexOf('intern') >= 0 || arguments[i].toLowerCase().indexOf('coop') >= 0) ) {
                return true;
            }
        }
        return false;
    },

    formatExperience: function(experience) {
        var out = '';
        for(var i = 0, l = experience.length; i < l; ++i) {
            out += experience[i].title.toUpperCase() + ' - ' + experience[i].company.toUpperCase() + ' - ' + experience[i].time.toUpperCase() + '\n' + experience[i].description + '\n---------\n';
        }
        return out.slice(0, -1);
    },

    yearsOfExperience: function(experience) {
        var time = 0;
        for(var i = 0, l = experience.length; i < l; ++i) {
            var timeArr = experience[i].time.replace(/,/g, '').split(' ');
            while(timeArr.length > 1 ) {

                // if # year
                if(!isNaN(timeArr[0]) && timeArr[1].toLowerCase().indexOf('year') >= 0) {
                    time += parseInt(timeArr[0], 10) || 0;

                    // if # month
                } else if(!isNaN(timeArr[0]) && timeArr[1].toLowerCase().indexOf('month') >= 0) {
                    time += (parseInt(timeArr[0], 10) || 0)/12 || 0;
                }

                // drop array indexes 0, 1
                timeArr = timeArr.slice(2);
            }
        }
        return Math.round(time*10)/10;
    },

    id: function() {
        return window.queryString('id') || null;
    }

};
