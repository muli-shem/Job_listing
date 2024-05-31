document.addEventListener('DOMContentLoaded', () => {
    const jobListingsContainer = document.querySelector('.job-listings');
    const searchInput = document.getElementById('search');
    const clearButton = document.getElementById('clearButton');
    const filterTagsContainer = document.getElementById('filterTags');
    let filterTags = [];

    const renderJobListings = (listings) => {
        jobListingsContainer.innerHTML = '';
        listings.forEach(job => {
            const jobListing = document.createElement('div');
            jobListing.classList.add('job-listing');
            if (job.featured) jobListing.classList.add('featured');

            jobListing.innerHTML = `
            <div class="job-listing_header">
                <div class="job-header">
                    <div class="company-logo" style="background-image: url('${job.logo}')"></div>
                    <div class="company-info">
                        <h2>${job.position}</h2>
                        <div class="job-meta">
                            <span>${job.company}</span>
                            <span>•</span>
                            <span>${job.postedAt}</span>
                            <span>•</span>
                            <span>${job.contract}</span>
                            <span>•</span>
                            <span>${job.location}</span>
                        </div>
                    </div>
                </div>
                <div class="job-tags">
                    <span class="tag" data-value="${job.role}">${job.role}</span>
                    <span class="tag" data-value="${job.level}">${job.level}</span>
                    ${job.languages.map(lang => `<span class="tag" data-value="${lang}">${lang}</span>`).join('')}
                    ${job.tools.map(tool => `<span class="tag" data-value="${tool}">${tool}</span>`).join('')}
                </div>
            </div>
            `;

            jobListingsContainer.appendChild(jobListing);
        });
    };

    const filterJobs = (query, listings) => {
        if (!query) {
            renderJobListings(listings);
            return;
        }

        const filteredJobs = listings.filter(job => {
            const jobTags = [job.role, job.level, ...job.languages, ...job.tools].join(' ').toLowerCase();
            return jobTags.includes(query.toLowerCase());
        });

        renderJobListings(filteredJobs);
    };

    const updateFilterTags = () => {
        filterTagsContainer.innerHTML = '';
        filterTags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.classList.add('tag');
            tagElement.textContent = tag;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'x';
            removeButton.addEventListener('click', () => {
                filterTags = filterTags.filter(t => t !== tag);
                updateFilterTags();
                filterJobs(filterTags.join(' '), jobData);
            });
            tagElement.appendChild(removeButton);
            filterTagsContainer.appendChild(tagElement);
        });
    };

    const fetchAndFilterJobs = () => {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                jobData = data;
                renderJobListings(data);
                searchInput.addEventListener('input', () => {
                    const query = searchInput.value.trim();
                    filterTags = query.split(' ').filter(tag => tag.length > 0);
                    updateFilterTags();
                    filterJobs(query, data);
                });
                clearButton.addEventListener('click', () => {
                    searchInput.value = '';
                    filterTags = [];
                    updateFilterTags();
                    renderJobListings(data);
                });
            })
            .catch(error => console.error('Error fetching job listings:', error));
    };

    fetchAndFilterJobs();
});
