'use strict';

/* HANDLEBARS */


const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorListLink : Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML),
};

/* GLOBAL */
const opt = {
  articleSelector: '.post', //# article list
  titleSelector: '.post-title', //# article title
  titleListSelector: '.titles', //# link list
  articleTagsSelector: '.post-tags .list', //# article tag list
  articleAuthorSelector: '.post-author',  //# author selector
  tagsListSelector: '.tags.list', //# right sidebar tag links
  cloudClassPrefix: 'tag-size-', //# class names for tag cloud
  cloudClassCount: 5, //# num of classes for tag cloud sizing
  authorsListSelector: '.authors.list', //# right sidebar author links
};



function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active');



  const activeArticles = document.querySelectorAll('.posts article.active');
  console.log('activeArticles:', activeArticles);
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  const articleSelector = clickedElement.getAttribute('href');

  const targetArticle = document.querySelector(articleSelector);

  targetArticle.classList.add('active');
}



function generateTitleLinks(customSelector = '') {

  const titleList = document.querySelector(opt.titleListSelector);

  titleList.innerHTML = '';

  const articles = document.querySelectorAll(opt.articleSelector + customSelector);

  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(opt.titleSelector).innerHTML;
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);

    titleList.insertAdjacentHTML('beforeend', linkHTML);
  }
  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = { min: '99999', max: '0' };
  for (let tag in tags) {
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }
  return params;
}


function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opt.cloudClassCount - 1) + 1);
  return classNumber;
}

const generateTags = function () {
  let allTags = {};
  const articles = document.querySelectorAll(opt.articleSelector);

  for (let article of articles) {
    const articleTagList = article.querySelectorAll(opt.articleTagsSelector);
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const tagArray = articleTags.split(' ');
    for (let tag of tagArray) {
      const linkHTMLData = { tag: tag };
      const linkHTML = templates.tagLink(linkHTMLData);
      html += linkHTML;
      if (!allTags[tag]) {

        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

    }

    articleTagList.forEach((element) => {
      element.insertAdjacentHTML('beforeend', html);
    });
  }
  const tagList = document.querySelector(opt.tagsListSelector);
  const tagsParams = calculateTagsParams(allTags);

  const allTagsData = { tags: [] };

  for (let tag in allTags) {
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams),
    });
  }

  tagList.innerHTML = templates.tagCloudLink(allTagsData);
};

generateTags();

function tagClickHandler(event) {

  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.substr(5);
  const activeTagList = document.querySelectorAll('a.active[href^="#tag-"]');

  for (let activeTag of activeTagList) {

    activeTag.classList.remove('active');

  }

  const clickedTagLinks = document.querySelectorAll('a[href="' + href + '"]');


  for (let clickedTagLink of clickedTagLinks) {

    clickedTagLink.classList.add('active');

  }

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

const addClickListenersToTags = function () {

  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

  for (let tagLink of tagLinks) {

    tagLink.addEventListener('click', tagClickHandler);

  }
};

addClickListenersToTags();

const calculateAuthorParams = function (authors) {
  let authorInstances = [];
  for (let author in authors) {

    authorInstances.push(authors[author]);
  }


  const params = {
    min: Math.min.apply(null, authorInstances),
    max: Math.max.apply(null, authorInstances),
  };

  return params;
};

const generateAuthors = function () {
  let allAuthors = {};
  const articles = document.querySelectorAll(opt.articleSelector);


  for (let article of articles) {
    const articleAuthorWrapper = article.querySelectorAll(opt.articleAuthorSelector);
    let html = '';

    const articleAuthor = article.getAttribute('data-author');


    let authorPersonals = articleAuthor.split(' ');
    const authorHTMLData = {
      id: articleAuthor,
      title: articleAuthor,
      name: authorPersonals[0],
      surname: authorPersonals[1],
    };
    const authorHTML = templates.authorLink(authorHTMLData);
    html += authorHTML;

    if (!allAuthors[articleAuthor]) {

      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }

    articleAuthorWrapper.forEach((element) => {
      element.insertAdjacentHTML('beforeend', html);

    });


    const authorList = document.querySelector(opt.authorsListSelector);
    const authorParams = calculateAuthorParams(allAuthors);

    const allAuthorsData = { authors: [] };

    for (let author in allAuthors) {
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateTagClass(allAuthors[author], authorParams),
      });
    }
    //* [HANLEBARS]
    authorList.innerHTML = templates.authorListLink(allAuthorsData);

  }
};

generateAuthors();

const authorClickHandler = function (event) {

  event.preventDefault();
  const clickedElement = this;

  const href = clickedElement.getAttribute('href');

  const authorTag = href.replace('#author-', '');

  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');

  for (let activeAuthor of activeAuthors) {

    activeAuthor.classList.remove('active');
  }
  const authorLinks = document.querySelectorAll(
    'a[href^="#author-' + authorTag + '"]'
  );


  for (let authorLink of authorLinks) {

    authorLink.classList.add('active');
  }
  generateTitleLinks('[data-author="' + authorTag + '"]');
};

const addClickListenersToAuthors = function () {

  const authorLinks = document.querySelectorAll('a[href^="#author-"]');


  for (let authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
 
};

addClickListenersToAuthors();

