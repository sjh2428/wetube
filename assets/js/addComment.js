import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
let jsComDelBtn = document.querySelectorAll(".CommentDelBtn");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
}

const decreaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) -1;
}

const DeleteCom = async (cid) => {
    // console.log(cid);
    const response = await axios({
        url: `/api/delcom`,
        method: "POST",
        data: {
            cid
        }
    });
    if (response.status === 200) {
        jsComDelBtn.forEach((btn) => {
            if (btn.getAttribute("data") === cid) {
                btn.parentNode.remove();
                decreaseNumber();
            }
        });
    }
}

const handleDeleteCom = (id) => {
    DeleteCom(id);
}

const addComment = (comment, id) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const button = document.createElement("button");
    button.classList.add("CommentDelBtn");
    button.innerHTML = "Del";
    button.setAttribute('data', id);
    button.addEventListener("click", () => {
        handleDeleteCom(id);
    }, false);
    li.appendChild(button);
    span.innerHTML = comment;
    li.prepend(span);
    commentList.prepend(li);
    increaseNumber();
    jsComDelBtn = document.querySelectorAll(".CommentDelBtn");
}

const sendComment = async(comment) => {
    const videoId = window.location.href.split("/videos/")[1];
    const response = await axios({
        url: `/api/${videoId}/comment`,
        method: "POST",
        data: {
            comment
        }
    });
    if(response.status === 200) {
        addComment(comment, response.data.data);
    }
}

const handleSubmit = (event) => {
    event.preventDefault();
    const commentInput = addCommentForm.querySelector("input");
    const comment = commentInput.value;
    sendComment(comment);
    commentInput.value = "";
}

function init() {
    addCommentForm.addEventListener("submit", handleSubmit);
    if(jsComDelBtn) {
        jsComDelBtn.forEach((btn) => {
            console.log('adding', btn.getAttribute('data'));
            btn.addEventListener("click", () => {
                handleDeleteCom(btn.getAttribute('data'));
            }, false);
        });
    }
    // jsComDelBtn.addEventListener("click", handleDeleteCom);
}

if(addCommentForm) {
    init();
}