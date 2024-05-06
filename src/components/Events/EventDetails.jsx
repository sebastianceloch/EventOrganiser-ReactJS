import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Header from '../Header.jsx';
import { fetchEvent, queryClient } from '../../util/http.js';
import { useParams } from 'react-router-dom';
import { deleteEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { useState } from 'react';
import Modal from '../UI/Modal.jsx';
export default function EventDetails() {


  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const id = useParams();
  const {data, isError, isPending} = useQuery({
    queryKey: ['events', id],
    queryFn: (signal) => fetchEvent(id, signal)
  });

  const {mutate, isPending: isPendingDeletion, isError: isErrorDeleting, error: deleteError} = useMutation({
    mutationFn: () => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['events'], refetchType: 'none'});
      navigate('/events');
    }
  });


  function handleStartDelete(){
    setIsDeleting(true);
  }

  function handleStopDelete(){
    setIsDeleting(false);
  }
  function handleDelete(){
    mutate();
  }
  console.log(data);

  let content;

  if(isPending){
    content = <div id="event-details-content" className='center'>
      <p>Fetchin event data</p>
      </div>
  }

  if(isError){
    content = <div id="event-details-content" className='center'>
      <ErrorBlock title="Failed to load event" message={error.info?.message || 'Failed to fetch data'}/>
      </div>
  }

  if(data){
    const formatedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    content = (
      <>
          <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
      <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
      <div id="event-details-info">
        <div>
          <p id="event-details-location">{data.location}</p>
          <time dateTime={`Todo-DateT$Todo-Time`}>{formatedDate} @ {data.time}</time>
        </div>
        <p id="event-details-description">{data.description}</p>
      </div>
      </div>
      </>
    );
  }
  return (
    <>
{   isDeleting && <Modal onClose={handleStopDelete}>
      <h2>Are you sure?</h2>
      <p>Do you really want to delete this event</p>
      <div className='form-actions'>
        {isPendingDeletion && <p>Deleting please wait...</p>}
        {!isPendingDeletion && <>
          <button onClick={handleStopDelete} className='button-text'>Cancel</button>
        <button onClick={handleDelete} className='button'>Delete</button>
        </>}
      </div>
      {isErrorDeleting && <ErrorBlock title="failed to delete" message={deleteError.info?.message || 'Please try agian later'}/>}
    </Modal>}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
      {content}
      </article>
    </>
  );
}
