import { Link, useNavigate, redirect, useSubmit, useNavigation } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent } from '../../util/http.js';
import { useQuery, useMutation } from '@tanstack/react-query';
import {useParams} from 'react-router-dom';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { updateEvent, queryClient } from '../../util/http.js';
export default function EditEvent() {
  const navigate = useNavigate();
  const {state} = useNavigation();
  const params = useParams();
  const submit = useSubmit();
  const { data, isError, error } = useQuery({
    queryKey: ['events', params.id],
    queryFn: ({signal}) => fetchEvent({signal, id: params.id}),
    staleTime: 10000
  })

  // const {mutate} = useMutation({
  //   mutationFn: updateEvent,
  //   onMutate: async (data) => {
  //     const newEvent = data.event;
  //     await queryClient.cancelQueries({queryKey: ['events', params.id]});
  //     const prevEvent = queryClient.getQueryData(['events', params.id]);
  //     queryClient.setQueryData(['events', params.id], newEvent);

  //     return {prevEvent}
  //   },
  //   onError: (error, data, context) => {
  //     queryClient.setQueryData(['events', params.id], content.prevEvent);
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries(['events', params.id]);
  //   }
  // });
  function handleSubmit(formData) {
    submit(formData, {method: 'PUT'});
    // mutate({
    //   id: params.id, 
    //   event: formData
    // });
    // navigate('../');
  }

  function handleClose() {
    navigate('../');
  }


  let content;



  if(isError){
    content = <>
    <ErrorBlock title="failed" message={error.info?.message || 'try again later'}/>
    <div className='form-actions'>
      <Link to="../" className='button'>Okay</Link>
    </div>
    </>

    if(data){
    }
  }
  return (
    <Modal onClose={handleClose}>
      {content}
{     data && <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === 'submitting' ? <p>Sending data</p> :
        <>
                <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
        </>
        }

      </EventForm>}
    </Modal>
  );
}


export function loader({params}){
  return queryClient.fetchQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({signal, id: params.id})
  });
}

export async function action({request, params}){
  const formData = await request.formData();
  const updatedFormData = Object.fromEntries(formData);
  await updateEvent({id: params.id, event: updatedFormData});
  await queryClient.invalidateQueries(['events'])
  return redirect('../');
}