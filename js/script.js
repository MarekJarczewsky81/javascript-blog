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
  // Usuń aktywną klase ze wszystkich linków artykułow
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  // Dodaj klase "active" do klikniętgo linku
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');


  // Usuń klase aktywną ze wszystkich artykułów
  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');
  console.log('activeArticles:', activeArticles);
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  // Dostań atrybut 'href' z klikniętego linku
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  // console.log('articleSelector:', articleSelector);

  // Znajdź poprawny artykuł uzywając selektor, który wskazuje na wartość atrybutu 'href
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  // console.log('targetArticle:', targetArticle);

  // Dodaj klase 'active' do poprawnego artykułu
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}



function generateTitleLinks(customSelector = '') {

  const titleList = document.querySelector(opt.titleListSelector);
  /* remove contents of titleList */

  // Wyczyść listę przed generowaniem nowych linków
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(opt.articleSelector + customSelector);

  // let html = '';
  /* for each article */
  for (let article of articles) {
  /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    const articleTitle = article.querySelector(opt.titleSelector).innerHTML;
    /* get the title from the title element */
    // const linkHTML =
    //     '<li><a href="#' +
    //     articleId +
    //     '"><span>' +
    //     articleTitle +
    //     '</span></a></li>';
    /* create HTML of the link */
    // console.log(linkHTML);
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);
    /* insert link into titleList */
    // titleList.innerHTML = titleList.innerHTML + linkHTML;
    // insert link into html variable
    // html = html + linkHTML;
    titleList.insertAdjacentHTML('beforeend', linkHTML);
  }

  // titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {
  //defining min and max of our parameters for tags
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
  /* [NEW] create a new variable allTags with an empty array */
  // NEW_NEW: change array to object
  /* [NEW] create variable for all links HTML code */
  // CREATEan OBJECT to store tag counts
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opt.articleSelector);
  // console.log('All articles:', articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const articleTagList = article.querySelectorAll(opt.articleTagsSelector);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    // console.log('articleTags:', articleTags);
    /* split tags into array */
    const tagArray = articleTags.split(' ');
    // console.log('articleTagsArray:', articleTagsArray);
    /* START LOOP: for each tag */
    for (let tag of tagArray) {
      // console.log('tag:', tag);
      /* generate HTML of the link */
      // const linkHTML =
      //   '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      //* [HANDLEBARS]
      const linkHTMLData = { tag: tag };
      const linkHTML = templates.tagLink(linkHTMLData);
      /* add generated code to html variable */
      // html = html + linkHTML;
      html += linkHTML;
      /* [NEW] check if this link is NOT already in allTags
       */
      if (!allTags[tag]) {
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    // tagList.innerHTML =+ html;
    articleTagList.forEach((element) => {
      element.insertAdjacentHTML('beforeend', html);
    });
  }
  /* END LOOP: for every article: */
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opt.tagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  // console.log("tagsParams: ", tagsParams);
  /* [NEW] add html from allTags to tagList */
  tagList.innerHTML = allTags.join('');
  // console.log('allTags: ', allTags);

  // [new] create variable for all links HTML code
  // let allTagsHTML = "";
  //*[HANLEBARS]
  const allTagsData = { tags: [] };
  // [new] loop through all tags in allTags
  for (let tag in allTags) {
    // [new] generate code of a link and add it to allTagsHTML
    // allTagsHTML += tag + " ( " + allTags[tag] + " ) ";
    // [new] END LOOP: for each tag in all Tags
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams),
    });
  }

  // [new] insert HTML of all tags links into tagList
  // tagList.innerHTML = allTagsHTML;
  // console.log("allTagsHTML: ", allTagsHTML);
  //*[HANDLEBARS]
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
};

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.substr(5);
  // or
  // const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTagList = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let activeTag of activeTagList) {
  /* remove class active */
    activeTag.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const clickedTagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let clickedTagLink of clickedTagLinks) {
    /* add class active */
    clickedTagLink.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

const addClickListenersToTags = function () {
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for (let tagLink of tagLinks) {
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
};

addClickListenersToTags();

const calculateAuthorParams = function (authors) {
  let authorInstances = [];
  for (let author in authors) {
    ////console.log(author + ' used ' + authors[author] + ' times');
    authorInstances.push(authors[author]);
  }
  ////console.log('authorInstances[] : ', authorInstances);
  //^ Return these numbers as an object containing 2 keys: max and min
  const params = {
    min: Math.min.apply(null, authorInstances),
    max: Math.max.apply(null, authorInstances),
  };

  return params;
};

const generateAuthors = function () {
  let allAuthors = {};
  const articles = document.querySelectorAll(opt.articleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {
    const articleAuthorWrapper = article.querySelectorAll(opt.articleAuthorSelector);
    let html = '';

    const articleAuthor = article.getAttribute('data-author');

    //* [HANDLEBARS]
    //or: const authorHTMLData = { author: articleAuthor };
    let authorPersonals = articleAuthor.split(' ');
    const authorHTMLData = {
      id: articleAuthor,
      title: articleAuthor,
      name: authorPersonals[0],
      surname: authorPersonals[1],
    };
    //^ generate HTML of the link
    //or: const authorHTML = 'by <a href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a>';
    //* [HANDLEBARS]
    const authorHTML = templates.authorLink(authorHTMLData);
    html += authorHTML;

    // for (let author of allAuthors) {
    //   const authorLinkHTML =
    //     '<li><a href="#author-' + author + '">' + author + "</a></li>";
    //   html += authorLinkHTML;
    //* [NEW] check if this link is NOT already in allAuthors
    if (!allAuthors[articleAuthor]) {
      //* [NEW] add articleAuthor to allAuthors object
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
    //^ LOOP: insert HTML of all the links into the tags wrapper
    articleAuthorWrapper.forEach((element) => {
      element.insertAdjacentHTML('beforeend', html);
      //or: element.innerHTML = html;
    });

    /* [[[[[ AUTHOR CLOUD ]]]] */
    //^ find list of authors in right column
    const authorList = document.querySelector(opt.authorsListSelector);
    const authorParams = calculateAuthorParams(allAuthors);
    //> console.log('authorParams: ', authorParams);

    //^ create variable for all links HTML code
    //or: let allAuthorsHTML = '';
    //* [HANLEBARS]
    const allAuthorsData = { authors: [] };

    //^ START LOOP: for each author in allAuthors:
    for (let author in allAuthors) {
      //^ generate code of a link and add it to allAuthorsHTML
      //or: allAuthorsHTML += '<li><a href="#author-' + author + '" class="' + calculateCloudClass(allAuthors[author], authorParams) + '"><span class="author-name">' + author + '</span></a></li>';
      //* [HANLEBARS] generate code of a link and add it to allAuthorsData
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateTagClass(allAuthors[author], authorParams),
      });
    }
    //* [HANLEBARS]
    authorList.innerHTML = templates.authorListLink(allAuthorsData);
    // authorList.innerHTML = html;
    // console.log("authorList:", authorList);
  }
};

generateAuthors();

const authorClickHandler = function (event) {
  //>console.log('> authorClickHandler is working!');
  //^ prevent default action for this event
  event.preventDefault();
  const clickedElement = this;
  //>console.log('clickedElement : ', clickedElement);
  //^ make a new constant "href" and read the attribute "href" of the clicked element
  const href = clickedElement.getAttribute('href');
  //^ make a new constant "authorTag" and extract authorTag from the "href" constant
  const authorTag = href.replace('#author-', '');
  //or: href.substr(8);
  //^ find all tag links with class active
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  //> console.log('activeAuthors : ', activeAuthors);

  //^ START LOOP: for each active author link
  for (let activeAuthor of activeAuthors) {
    //^ remove class active
    activeAuthor.classList.remove('active');
  }
  //^ END LOOP: for each active tag link

  //^ find all author links with "href" attribute equal to the "href" constant
  const authorLinks = document.querySelectorAll(
    'a[href^="#author-' + authorTag + '"]'
  );

  //^ START LOOP: for each found tag link
  for (let authorLink of authorLinks) {
    //^ add class active
    authorLink.classList.add('active');
    //> console.log('authorLink : ', authorLink);
  }
  //^ END LOOP: for each found author link

  //! execute function "generateTitleLinks" with author selector as argument
  generateTitleLinks('[data-author="' + authorTag + '"]');
};

const addClickListenersToAuthors = function () {
  //^ find all links to authors
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');

  //^ START LOOP: for each link
  for (let authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
  //^ END LOOP: for each link
};

addClickListenersToAuthors();

