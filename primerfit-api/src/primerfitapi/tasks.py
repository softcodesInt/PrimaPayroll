from apscheduler.schedulers.background import BackgroundScheduler



def start_background_task():
    print("background task starting")
    scheduler = BackgroundScheduler()
    scheduler.start()
