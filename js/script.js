'use strict';


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

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleTagsActiveSelector = '.post-tags .list.active',
  optTagsListSelector = '.tags.list',
  optArticleAuthorSelector = '.post-author .list',
  optAuthorListSelector = '.autors.list';

function generateTitleLinks(customSelector = '') {

  const titleList = document.querySelector(optTitleListSelector);
  /* remove contents of titleList */

  // Wyczyść listę przed generowaniem nowych linków
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';
  /* for each article */
  for (let article of articles) {
  /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* get the title from the title element */
    const linkHTML =
        '<li><a href="#' +
        articleId +
        '"><span>' +
        articleTitle +
        '</span></a></li>';
    /* create HTML of the link */
    // console.log(linkHTML);
    /* insert link into titleList */
    // titleList.innerHTML = titleList.innerHTML + linkHTML;
    // insert link into html variable
    html = html + linkHTML;
  }

  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

const tagsParams = calculateTagsParams(allTags);
console.log('tagsParams:', tagsParams);

function calculateTagsParams(tags) {
  for(let tag in tags) {
    console.log(tag + 'is used' + tags[tag] + 'times');
  }
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty array */
  // NEW_NEW: change array to object
  /* [NEW] create variable for all links HTML code */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  console.log('All articles:', articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagList = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    // console.log('articleTags:', articleTags);
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    // console.log('articleTagsArray:', articleTagsArray);
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      // console.log('tag:', tag);
      /* generate HTML of the link */
      const linkHTML =
        '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags
       */
      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagList.innerHTML =+ html;

  }
  /* END LOOP: for every article: */
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  /* [NEW] add html from allTags to tagList */
  tagList.innerHTML = allTags.join(' ');
  // console.log('allTags: ', allTags);

  // [new] create variable for all links HTML code
  let allTagsHTML = '';
  // [new] loop through all tags in allTags
  for (let tag in allTags) {
    // [new] generate code of a link and add it to allTagsHTML
    allTagsHTML += tag + ' ( ' + allTags[tag] + ' ) ';
    // [new] END LOOP: for each tag in all Tags
  }

  // [new] insert HTML of all tags links into tagList
  tagList.innerHTML = allTagsHTML;
  console.log('allTagsHTML: ', allTagsHTML);
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const tagsActive = document.querySelectorAll(optArticleTagsActiveSelector);
  /* START LOOP: for each active tag link */
  for (let tagActive of tagsActive) {
  /* remove class active */
    tagActive.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {
  /* add class active */
    tagLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('.post-tags .list a');
  /* START LOOP: for each link */
  for (let tagLink  of tagLinks) {
  /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {
    const authorList = article.querySelector(optArticleAuthorSelector);
    let html = '';
    const articleAuthor = article.getAttribute('data-author');

    for (let author of allAuthors) {
      const authorLinkHTML =
      '<li><a href="#author-' + author + '">' + author + '</a></li>';
      html += authorLinkHTML;
    }
    authorList.innerHTML = html;
  }
}

generateAuthors();




function addClickListenersToAuthors() {

  const authorLinks = document.querySelectorAll('.post-author a');

  for (let authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();

