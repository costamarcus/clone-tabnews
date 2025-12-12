function status(request, response) {
  response.status(200).json({
    msg: "alunos do curso.dev são pessoal acima da média",
  });
}

export default status;
