"use strict";


function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log("clickedElement (with plus): " + clickedElement);
  console.log("Link was clicked!");

  // Usuń aktywną klase ze wszystkich linków artykułow
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll(".titles a.active");
  for (let activeLink of activeLinks) {
    activeLink.classList.remove("active");
  }

  // Dodaj klase "active" do klikniętgo linku
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add("active");
  console.log("clickedElement:", clickedElement);

  // Usuń klase aktywną ze wszystkich artykułów
  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll(".posts article.active");
  console.log("activeArticles:", activeArticles);
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove("active");
  }

  // Dostań atrybut 'href' z klikniętego linku
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute("href");
  console.log("articleSelector:", articleSelector);

  // Znajdź poprawny artykuł uzywając selektor, który wskazuje na wartość atrybutu 'href
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log("targetArticle:", targetArticle);

  // Dodaj klase 'active' do poprawnego artykułu
  /* add class 'active' to the correct article */
  targetArticle.classList.add("active");
}



const links = document.querySelectorAll(".titles a");

for (let link of links) {
    link.addEventListener("click", titleClickHandler);
  }
