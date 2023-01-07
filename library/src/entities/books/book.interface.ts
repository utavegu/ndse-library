export interface IBook {
	title: string
	description: string
	authors: string[]
  favorite?: string
  fileCover?: string
  fileName?: string
  fileBook?: string
}

export interface ICreateBookDto {
  title: IBook['title']
	description: IBook['description']
	authors: IBook['authors']
  favorite?: IBook['favorite']
  fileCover?: IBook['fileCover']
  fileName?: IBook['fileName']
  fileBook?: IBook['fileBook']
}